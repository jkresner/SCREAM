var ObjUtil;

module.exports = {


  init({Path, Fs, Util}, cfg) {
    if (!cfg.paths.fixtures) return
    ObjUtil = Util.Obj
    Fs.readdirSync(cfg.paths.fixtures).forEach(file => {
      if (file.match(/(\.(js|coffee)$)/)) {
        var fixtureName = file.split('.')[0]
        try {
          var rawFixture = require(Path.join(cfg.paths.fixtures,file))
        } catch (e) {
          console.log('\n\nFailed to require fixture: '.red, ('FIXTURE.'+fixtureName).white, '\n')
          throw e
        }
        for (var member in rawFixture)
          ObjUtil.deepFreeze(rawFixture[member])
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
      throw Error(`Uniquify fail. Fixture called ${fixtureName} not found`)

    if (!FIXTURE[fixtureName][objKey])
      throw Error(`Uniquify fail. No obj on FIXTURE.${fixtureName} with key ${objKey}`)

    var obj = this.clone(`${fixtureName}.${objKey}`)
    obj.key = objKey+suffix

    for (var attr of attrs) {
      var val = ObjUtil.get(obj, attr)
      if (val) ObjUtil.set(obj, attr, val + suffix)
    }

    if (obj._id && obj._id.constructor === ObjectId)
      obj._id = new ObjectId()

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
