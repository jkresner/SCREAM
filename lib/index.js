var  colors     = require('colors')
var Fs         = require('fs')
var Path       = require('path')
var Util       = require('./_util')
var Cmd        = require('./cmd')


module.exports = function(rootDir, appConfig, opts) {
  var deps     = { Fs, Path, Util }
  var opts     = opts || {}
  opts.cmd     = opts.cmd||Cmd()

  //-- screamConfig (as opposed to appConfig)
  var cfg      = require('./config')(deps, rootDir, appConfig, opts)
  colors.setTheme(cfg.colors)


  var Mocha    = require('mocha')
  var mochaOpts = {bail:true}
  if (opts.cmd.grep) mochaOpts.grep = opts.cmd.grep
  var mocha    = new Mocha(mochaOpts)
  mocha.addFile(__filename.replace('index','runner'))


  function init(done) {
    var onDone = !opts.onReady ? done : function() {
      opts.onReady.apply(this, arguments)
      done.apply(this, arguments)
    }

    cfg.specCtx       = this
    global.TIMEOUT    = ms => this.runnable().timeout(ms)
    if (cfg.init)     TIMEOUT(cfg.init.timeout||2000)

    require(cfg.paths.flavors)
    require('./http')(cfg)

    if (cfg.muted || cfg.verbose)
      console.log('  SCREAM.Output '.spec, `${cfg.muted ? 'muted' : 'verbose'}`)

    if (cfg.verbose) console.log('  SCREAM.HTTP    ok '.spec)

    require('./db')(deps, cfg, (ee, db) => {
      if (ee) return done(ee)
      if (cfg.verbose) console.log('  SCREAM.DB      loaded '.spec)

      try { var App   = opts.app == 'empty' ? Util.App.empty : require(cfg.paths.app)
      } catch (e) { throw Error("Failed to load server/app.js, did you mean to set a custom app.js path in config.json?") }

      if (cfg.verbose) console.log('  SCREAM.App     contructor good '.spec)
      global.moment   = require("moment")
      global.DATA     = {
        newId: () => new db.ObjectId(),
        timeSeed: (prefix) => (prefix||'')+moment().format('X')
      }
      global.DB       = db
      global.ISODate  = db.ISODate
      global.ObjectId = db.ObjectId
      global.FIXTURE  = require('./fixture').init(deps, cfg)
      if (cfg.verbose) console.log('  SCREAM.fixture  initialized '.spec)
      global.LOGIN    = require('./auth').login(cfg, appConfig, opts.login)
      global.OAUTH    = require('./auth').oauth(cfg, appConfig, opts.oauth)
      global.STUB     = require('./stubs')(deps, cfg, db)
      global.STORY    = require('./stories')(deps, cfg)

      var dbSeeder    = require('./dbseed')(deps, cfg, db)
      dbSeeder.testToSeed((e, seedIt) => {
        if (e)
          onDone(e)
        else if (!seedIt)
          global.APP = App.run(appConfig, onDone)
        else
        {
          console.log('  SCREAM.Seeding'.spec, `${cfg.seed.clean?"(clean)":"(dirty)"}`.seed)
          TIMEOUT(cfg.seed.timeout)
          dbSeeder.restoreBSONData(onDone)
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
    config:     cfg,
    run:        cb => mocha.run((failures)=>{})
                         .on('fail', f => {})
                         .on('end', f => cb?cb(f):process.exit(f))
  }
}

module.exports.Commander = Cmd
