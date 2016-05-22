module.exports = function(deps, testOpts, initDone) {


  var {onReady,app,$logIt} = testOpts
  var {paths,init} = testOpts.config


  return {

    run() {
      var appOpts = arguments[0] || {}
      var appDone = appOpts.constructor == Object ? appOpts.done : appOpts
      var done = function(e) {
        if (e) return initDone(e)
        if (onReady) onReady.apply(this, arguments)
        if (appDone) appDone.apply(this, arguments)
        initDone()
      }

      $logIt('INIT', `${testOpts.config.init.timeout}ms`)
      global.CTX = this
      global.TIMEOUT = ms => global.CTX.runnable().timeout(ms)
      TIMEOUT(30000||init.timeout)

      require('./flavors')
      require('./http')(deps, testOpts)
      $logIt('HTTP', 'ok')


      require('./db')(deps, testOpts, function(ee, db) {
        if (ee) return done(ee)
        global.moment   = global.moment || require("moment")
        global.DATA     = {
          newId: x => new db.ObjectId(),
          timeSeed: prfx => (prfx||'')+moment().format('X')
        }
        global.DB       = db
        global.ISODate  = db.ISODate
        global.ObjectId = db.ObjectId
        global.FIXTURE  = require('./fixture').init(deps, testOpts)
        $logIt('FIXTURE', 'initialized')
        global.LOGIN    = require('./auth.login')(deps, testOpts, appOpts.config)
        global.OAUTH    = require('./auth.oauth')(deps, testOpts, appOpts.config)
        global.STUB     = require('./stubs')(deps, testOpts)
        global.STORY    = require('./stories')(deps, testOpts)
        $logIt('DB', 'loaded')
        // try {

        // } catch (e) {
          // var entry = paths.app.replace('app.js','index.js')
          // console.log(`\n${opts.config.verbose?e.message:e.stack} executing ${paths.app}\n`.red)
          // if (!e.stack.match('SyntaxError'))
            // return error(Error(`Failed to load ${paths.app}, check paths.app in scream.json?`))
          // else {
          // error()
            // var fork = require('child_process').fork(entry, ['--harmony_destructuring'],{detached:true})
          // }
        // }
        // if (fork) return fork.on('error', error)

        var dbSeeder    = require('./dbseed')(deps, testOpts, db)
        dbSeeder.testToSeed((eee, seedIt) => {
          $logIt('SEEDING', seedIt)
          if (eee) return done(eee)
          var App = app ? deps.Util.App[app] : require(paths.app)
          // $logIt('App', 'constructor good')
          if (seedIt)
            dbSeeder.restoreBSONData(e =>
              global.APP = e ? done(e) : App.run(appOpts, done))
          else
            global.APP = App.run(appOpts, done)
        })
      })
    }

  }
}
