'use strict';

module.exports = ({Path, Fs, Util}, cfg) => ({

  init() {
    Fs.readdirSync(cfg.paths.fixtures).forEach(file => {
      if (file.match(/\.js$/) || file.match(/\.coffee$/)) {
        var fixtureName = file.split('.')[0]
        var rawFixture = require(Path.join(cfg.paths.fixtures,file))
        for (var member in rawFixture)
          Util.Obj.deepFreeze(rawFixture[member])
        this[fixtureName] = rawFixture
      }
    })
    return this
  },

  uniquify(fixtureName, objKey, attrs) {
    if (attrs && attrs.constructor == String) attrs = attrs.split(' ')
    if (!attrs || attrs.length == 0)
      throw Error(`Uniquify failed. No attrs speficied to uniquify for ${JSON.stringify(obj)}`)

    var suffix = parseInt(moment().format('X'))
    if (!FIXTURE[fixtureName])
      throw Error(`Uniquify failed. Fixture called ${fixtureName} found`)
    var original = FIXTURE[fixtureName][objKey]
    if (!original)
      throw Error(`Uniquify failed. No obj on FIXTURE.${fixtureName} with key ${objKey}`)

    var obj = { key: objKey+suffix }

    for (var attr of attrs) {
      var val = Util.Obj.get(original, attr)
      if (val) Util.Obj.set(obj, attr, val + suffix)
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

    return Util.Obj.copyAttrs(original, attrs)
  }


})
