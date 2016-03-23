module.exports = function(deps, opts) {

  var {onReady,app,$logIt,Config} = opts
  var {init,paths,seed} = Config

  return {

    run(appOpts, onDone) {
      appOpts = appOpts || {}
      onDone = onDone || (x=>{})
      var appCfg = appOpts.config || appOpts  // || supports older meanair apps
      $logIt('Output')

      var done = !onReady ? onDone : function() {
        onReady.apply(this, arguments)
        onDone.apply(this, arguments)
      }

      Config.specCtx       = this
      global.TIMEOUT       = ms => this.runnable().timeout(ms)
      if (init)     TIMEOUT(init.timeout||2000)

      require(paths.flavors)
      require('./http')(deps, {Config})
      $logIt('HTTP', 'ok')

      require('./db')(deps, {Config}, (ee, db) => {
        if (ee) return onDone(ee)
        $logIt('DB', 'loaded')
        try { var App   = app == 'empty' ? deps.Util.App.empty : require(paths.app) }
        catch (e) { throw Error(`Failed to load server/app.js[${paths.app}], did you mean to set app.js path in scream.json?`) }

        $logIt('App', 'constructor good')
        global.moment   = global.moment || require("moment")
        global.DATA     = {
          newId: x => new db.ObjectId(),
          timeSeed: prfx => (prfx||'')+moment().format('X')
        }
        global.DB       = db
        global.ISODate  = db.ISODate
        global.ObjectId = db.ObjectId
        global.FIXTURE  = require('./fixture').init(deps, {Config})
        $logIt('FIXTURE', 'initialzied')
        global.LOGIN    = require('./auth.login')(deps, opts, appCfg)
        global.OAUTH    = require('./auth.oauth')(deps, opts, appCfg)
        global.STUB     = require('./stubs')(deps, opts)
        global.STORY    = require('./stories')(deps, opts)

        $logIt('CHECKING', 'seeds')
        var dbSeeder    = require('./dbseed')(deps, opts, db)
        dbSeeder.testToSeed((e, seedIt) => {
          if (e)
            done(e)
          else if (!seedIt)
            global.APP = App.run(appCfg, Object.assign(appOpts.opts||{},{done}))
          else
          {
            $logIt('Seeding', `${seed.clean?"(clean)":"(dirty)"}`)
            TIMEOUT(seed.timeout)
            dbSeeder.restoreBSONData(done)
            global.APP = App.run(appCfg, appOpts.opts)
          }
        })
      })

    }


  }
}
