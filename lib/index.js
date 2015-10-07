
module.exports = function(rootDir, appConfig, screamLogin) {

  var Fs       = require('fs')
  var Path     = require('path')
  var colors   = require('colors')
  var deps     = {Fs,Path}
  var cfg      = require('./config')(deps, rootDir, appConfig)
  colors.setTheme(cfg.colors)

  var Mocha    = require('mocha')
  var mocha    = new Mocha({bail:true})
  mocha.addFile(__filename.replace('index','runner'))

  function init(done) {
    cfg.specCtx       = this
    require(cfg.paths.flavors)
    require('./http')(cfg)

    require('./db')(deps, cfg, (ee, db) => {
      if (ee) return done(ee)

      var Data        = require('./data')(deps, cfg, db)

      try { var App   = require(cfg.paths.app) }
      catch (e) { throw Error("Failed to load server/app.js, did you mean to set a custom app.js path in config.json?") }

      global.moment   = require("moment")
      global.DB       = db
      global.ObjectId = db.ObjectId
      global.ISODate  = db.ISODate
      global.FIXTURE  = Data.fixture()
      global.LOGIN    = require('./login')(cfg, appConfig, screamLogin)
      global.STUB     = require('./stubs')(deps, cfg, db)

      Data.testToSeed((e, seedIt) => {
        console.log('SCREAM.Seeding'.seed, seedIt ? `${cfg.seed.clean?"(clean)":"(dirty)"}` : 'false')
        if (e)
          done(e)
        else if (!seedIt)
          global.APP = App.run(appConfig, done)
        else
        {
          this.runnable().timeout(cfg.seed.timeout)
          Data.restoreBSONData(done)
          global.APP = App.run(appConfig)
        }
      })
    })
  }


  var runAll = !cfg.specs || cfg.specs == 'all'
  var specs = Fs.readdirSync(cfg.paths.specs)
                .filter(f => ['.js','.coffee'].indexOf(Path.extname(f))!=-1)
                .map(file => file.replace(Path.extname(file),''))
                .filter(name => runAll || cfg.specs.indexOf(name) != -1)

  global._RUNNER = { specs, cfg, init }

  return {
    config:   cfg,
    run:      (cb) => mocha.run((failures)=>{})
                         .on('fail', f => {})
                         .on('end', f => cb?cb(f):process.exit(f))
  }

}
