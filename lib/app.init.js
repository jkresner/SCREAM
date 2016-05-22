module.exports = function(done) {

  var {$logIt} = OPTS
  var {paths,init} = OPTS.config

  var error = done
  var success = () =>

    done()

  // var appOpts = arguments[0] || {}
  // var appDone = appOpts.constructor == Object ? appOpts.done : appOpts
  // var done = function(e) {
    // if (e) return initDone(e)
    // if (appDone) appDone.apply(this, arguments)
    // initDone()
  // }

  $logIt('APP_INIT', `${init.timeout}ms`)
  global.CTX = this
  global.TIMEOUT = ms => global.CTX.runnable().timeout(ms)
  TIMEOUT(30000||init.timeout)

  require('./flavors')
  require('./http')(deps, OPTS)
  $logIt('HTTP', 'ok')


  require('./db')(deps, OPTS, function(ee, db) {
    if (ee) return done(ee)
    global.moment   = global.moment || require("moment")
    global.DATA     = {
      newId: x => new db.ObjectId(),
      timeSeed: prfx => (prfx||'')+moment().format('X')
    }
    global.DB       = db
    global.ISODate  = db.ISODate
    global.ObjectId = db.ObjectId
    global.FIXTURE  = require('./fixture').init(deps, OPTS)
    $logIt('FIXTURE', `${FIXTURE.keys.join('|')}`)
    global.LOGIN    = require('./auth.login')(deps, OPTS) //, appOpts.config)
    global.OAUTH    = require('./auth.oauth')(deps, OPTS) //, appOpts.config)
    global.STUB     = require('./stubs')(deps, OPTS)
    global.STORY    = require('./stories')(deps, OPTS)
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

    var dbSeeder  = require('./dbseed')(deps, OPTS, db)
    dbSeeder.testToSeed((eee, seedIt) => {
      $logIt('SEEDING', seedIt)
      if (eee) done(eee)
      else if (seedIt) dbSeeder.restoreBSONData(done)
      else done()
    })
  })

}
