function Configure({Path}, opts) {

  var root = Path.dirname(process.mainModule.filename)
  var cmd = opts.cmd
  var defaults = require('./config.defaults.json')
  var file   = (cmd.config || 'scream')+'.json'
  var instance = require( Path.normalize(`${root}/${file}`) )


  var validate = (cfg) => {
    if (!cfg) return `SCREAM Config object required`
    var {mongo,paths} = cfg

    if (mongo && !mongo.collections) return `No mongo collections specified`
    if (mongo && !mongo.url) return `Mongo url not provided`
    if (mongo && mongo.seed) {
      if (!paths || !paths.fixtures) return `.paths.fixtures dir needed with mongo.seed`
      if (!paths || !paths.bson) return `.paths.bson import dir needed with mongo.seed`
      if (!mongo.seed.without) return `.mongo.seed.without trigger needed with mongo.seed`
      if (!mongo.seed.without.match(/^FIXTURE\./)) return `.mongo.seed.without currently supports only FIXTURE`
    }

    if (!cmd) return
    if (cmd.forceSeed && !mongo.seed) return `mongo.seed settings missing for --force-seed command`
    if (cmd.dirtySeed && !mongo.seed) return `mongo.seed settings missing for --dirty-seed command`
  }


  var setCommandOptions = (cfg) => {

    if (cmd.seed) cfg.mongo.seed.force = true
    if (cmd.dirty) cfg.mongo.seed.dirty = true
    if (cmd.only) cfg.specs = cmd.only
    if (cmd.verbose) cfg.verbose = true
    if (cmd.terse) cfg.terse = true
    if (cmd.logFlag) cfg.logFlag = cmd.logFlag.toUpperCase()

    if (cfg.logFlag) process.env[`LOG_IT_${cfg.logFlag}`] = 'white'
    if (cfg.verbose) process.env[`LOG_VERBOSE`] = 'white'
    else if (cfg.terse) process.env[`LOG_TERSE`] = 'white'

    return cfg
  }


  var setDefaults = (cfg) => {

    var specs            = cfg.specs || 'all'
    var colors           = Object.assign(defaults.colors,cfg.colors||{})
    var stubs            = Object.assign(defaults.stubs, cfg.stubs||{})
    var setup            = Object.assign(defaults.setup, cfg.setup||{})
    if ((opts.setup||{}).done) {
      setup.done = opts.setup.done
      delete opts.setup
    }

    var paths            = cfg.paths||{}
    paths.root           = root
    paths.codeExt        = /\.(js|coffee)$/
    paths.app            = Path.normalize(`${root}/${paths.app||'../../server/app.js'}`)
    paths.specs          = Path.normalize(`${root}/${paths.specs||'specs'}`)
    if (paths.fixtures)  paths.fixtures = Path.normalize(`${root}/${paths.fixtures}`)
    if (paths.bson)      paths.bson = Path.normalize(`${root}/${paths.bson}`)
    if (paths.stories)   paths.stories = Path.normalize(`${root}/${paths.stories}`)
    paths.slang = paths.slang ? Path.normalize(`${root}/${paths.slang}`) : './scream.slang'

    if (cfg.mongo) {
      if (cfg.mongo.seed)
        cfg.mongo.seed = Object.assign(defaults.mongo.seed, cfg.mongo.seed)
      cfg.db = { mongo: cfg.mongo }
      delete cfg.mongo
    }

    var http = cfg.http || defaults.http

    var mocha = { bail: true, fullStackTrace: false, reporter: 'spec' }
    mocha.rootFile = Path.join(__dirname , 'runner')
    if (cmd.grep) mocha.grep = cmd.grep


    return Object.assign(cfg, {setup, colors, paths, stubs, http, mocha, specs})
  }


  var inValid = validate(instance)
  if (inValid) throw Error(`SCREAM config: ${inValid} at ${file}`)

  return setDefaults(setCommandOptions(instance))

}


module.exports = Configure
