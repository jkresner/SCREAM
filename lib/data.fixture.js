var fs        = require('fs')
var {join}    = require('path')

var {paths}   = OPTS.config
if (!paths.fixtures) return

var ObjUtil = deps.Util.Obj

if (!global.ObjectId)
  global.ObjectId = require('mongodb').ObjectId

var fix = {

  uniquify(fixtureName, objKey, attrs) {
    if (attrs && attrs.constructor == String) attrs = attrs.split(' ')
    if (!attrs || attrs.length == 0)
      throw Error(`FIXTURE.Uniquify(${fixtureName}, ${objKey}, <attrs>) fail => <attrs> required`)

    var suffix = parseInt(moment().format('X'))
    if (!FIXTURE[fixtureName])
      throw Error(`FIXTURE.Uniquify fail => FIXTURE.${fixtureName} undefined`)

    if (!FIXTURE[fixtureName][objKey])
      throw Error(`FIXTURE.Uniquify fail => FIXTURE.${fixtureName}.${objKey} undefined`)

    var obj = this.clone(`${fixtureName}.${objKey}`)
    obj.key = objKey+suffix

    for (var attr of attrs) {
      var val = ObjUtil.get(obj, attr)
      if (val) ObjUtil.set(obj, attr, val + suffix)
    }

    if (obj._id && obj._id.constructor === ObjectId)
      obj._id = new ObjectId()

    // hack
    if (attrs.indexOf('auth.gh.emails.email') != -1) {
      for (var item of (obj.auth.gh.emails||[])) {
        item.email = item.email + suffix
        if (item._id) item._id = new ObjectId()
      }
    }
    if (attrs.indexOf('emails.value') != -1) {
      for (var item of (obj.emails||[])) {
        item.value = item.value + suffix
        if (item._id) item._id = new ObjectId()
      }
    }

    FIXTURE[fixtureName][obj.key] = obj
    return obj.key
  },

  clone(key, opts) {
    var bits = key.split('.')
    var fixtureName = bits[0]
    var objKey = bits[1]
    if (!FIXTURE[fixtureName])
      throw Error(`Clone failed. Fixture called ${fixtureName} found`)
    var original = FIXTURE[fixtureName][objKey]
    if (!original)
      throw Error(`Clone failed. No obj on FIXTURE.${fixtureName} with key ${objKey}`)


    var clone = {}
    var attrs = !opts ? Object.keys(original) : []

    opts = opts || {}
    if (opts.pick)
      attrs = opts.pick.split(' ')
    else if (opts.omit) {
      var omit = opts.omit.split(' ')
      for (var attr of Object.keys(original))
        if (omit.indexOf(attr) == -1) attrs.push(attr)
    }

    return ObjUtil.copyAttrs(original, attrs)
  }
}

var keys = ''
fs.readdirSync(paths.fixtures)
  .filter(file => file.match(paths.codeExt))
  .map(f => f.replace(paths.codeExt,''))
  .forEach(name => {
    try {
      var raw = require(join(paths.fixtures, name))
    } catch (e) {
      console.log(`\n\nRequire fixture ${name} failed\n`.red)
      throw e
    }
    for (var member in raw) ObjUtil.deepFreeze(raw[member])

    keys += name + ' '
    fix[name] = raw
  })

OPTS.log.setup('FIXTURE', keys)


module.exports = fix
