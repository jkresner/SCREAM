module.exports = function(deps, opts) {

  var {onReady,app,$logIt} = opts
  var {paths,init} = opts.config

  return {

    run() {
      var args = [].slice.call(arguments)
      var last = args.pop()

      var appOpts = last.constructor == Object ? last : (args[0]||{})
      var appDone = last.constructor == Function ? last : appOpts.done
      var done = function(e) {
        if (!e && onReady) onReady.apply(this, arguments)
        if (appDone) appDone.apply(this, arguments)
      }
      appOpts.done = done

      $logIt('INIT', `${opts.config.init.timeout}ms`)
      global.CTX = this
      global.TIMEOUT = ms => global.CTX.runnable().timeout(ms)
      TIMEOUT(30000||init.timeout)

      require('./flavors')
      require('./http')(deps, opts)
      $logIt('HTTP', 'ok')

      require('./db')(deps, opts, (ee, db) => {
        if (ee) return done(ee)
        $logIt('DB', 'loaded')
        var App = app ? deps.Util.App[app] : require(paths.app)
        // try {}
        // catch (e) {
        //   if (opts.config.verbose) console.log(`\n${e.stack}`.red)
        //   throw Error(`Failed to load server/app.js[${paths.app}], did you mean to set app.js path in scream.json?`)
        // }

        $logIt('App', 'constructor good')
        global.moment   = global.moment || require("moment")
        global.DATA     = {
          newId: x => new db.ObjectId(),
          timeSeed: prfx => (prfx||'')+moment().format('X')
        }
        global.DB       = db
        global.ISODate  = db.ISODate
        global.ObjectId = db.ObjectId
        global.FIXTURE  = require('./fixture').init(deps, opts)
        $logIt('FIXTURE', 'initialized')
        global.LOGIN    = require('./auth.login')(deps, opts, appOpts.config)
        global.OAUTH    = require('./auth.oauth')(deps, opts, appOpts.config)
        global.STUB     = require('./stubs')(deps, opts)
        global.STORY    = require('./stories')(deps, opts)

        var dbSeeder    = require('./dbseed')(deps, opts, db)
        dbSeeder.testToSeed((e, seedIt) => {
          opts.$logIt('SEEDING', seedIt)
          if (e)
            done(e)
          else if (seedIt)
            dbSeeder.restoreBSONData(e =>
              global.APP = e ? done(e) : App.run(appOpts, done))
          else
            global.APP = App.run(appOpts, done)
        })
      })
    }

  }
}
