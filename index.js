module.exports = function(rootDir, appConfig, screamLogin) {

  var Fs       = require('fs')
  var Path     = require('path')
  var deps     = {Fs,Path}

  var cfg      = require('./lib/config')(deps, rootDir, appConfig)
  var colors   = require('colors')
  colors.setTheme(cfg.colors)

  var runner   = require('./lib/runner')(deps, cfg)

  function init(done) {
    cfg.specCtx       = this

    require('./lib/db')(deps, cfg, (ee, db) => {
      var data        = require('./lib/data')(deps, cfg, db)

      global.DB       = db
      global.ObjectId = DB.ObjectId
      global.ISODate  = DB.ISODate
      global.FIXTURE  = data.fixture()

      data.testToSeed((e, seedIt) => {
        if (e||!seedIt) return done(e)
        this.runnable().timeout(cfg.seed.timeout)
        data.restoreBSONData(done)
      })
    })

    require(cfg.paths.flavors)
    require('./lib/http')(cfg)
    global.LOGIN      = require('./lib/login')(cfg, appConfig, screamLogin)
    global.APP        = require(cfg.paths.app).run(appConfig)

  }

  return {
    config:   cfg,
    run:      () => runner.run(init, ()=>LOGOUT())
  }

}
