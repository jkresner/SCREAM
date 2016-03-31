function Configure({Path}, {root,cmd}) {

  var defaults = require("./config.defaults.json")


  cmd = cmd || {}
  var src = cmd.config ? cmd.config : 'scream.json'
  var screamConfig = require(Path.normalize(`${root}/${src}`))


  var validate = (cfg) => {
    if (!cfg) return `SCREAM Config object required`
    var {mongo,paths} = cfg

    if (mongo && !mongo.collections) return `No mongo collections specified`
    if (mongo && !mongo.url) return `Mongo url not provided`
    if (mongo && mongo.seed) {
      if (!paths || !paths.fixtures) return `.paths.fixtures dir needed with mongo.seed`
      if (!paths || !paths.bson) return `.paths.bson import dir needed with mongo.seed`
      if (!mongo.seed.without) return `.mongo.see.without trigger needed with mongo.seed`
      if (!mongo.seed.without.match(/^FIXTURE\./)) return `.mongo.seed.without currently supports only FIXTURE`
    }

    if (!cmd) return
    if (cmd.forceSeed && !mongo.seed) return `mongo.seed settings missing for --force-seed command`
    if (cmd.dirtySeed && !mongo.seed) return `mongo.seed settings missing for --dirty-seed command`
  }


  var setCommandOptions = (cfg) => {

    if (cmd.forceSeed) cfg.mongo.seed.force = true
    if (cmd.dirtySeed) cfg.mongo.seed.clean = false
    if (cmd.specs) cfg.specs = cmd.specs
    if (cmd.logFlag) process.env[`LOG_${cmd.logFlag.toUpperCase}`] = 'white'
    if (cmd.verbose) process.env[`LOG_APP_VERBOSE`] = 'white'
    if (cmd.muted) process.env[`LOG_APP_MUTE`] = 'white'
    if (cmd.verbose) cfg.verbose = true
    if (cmd.muted) cfg.muted = true

    return cfg
  }


  var setDefaults = (cfg) => {

    var colors = Object.assign(defaults.colors,cfg.colors||{})
    var stubs = Object.assign(defaults.stubs, cfg.stubs||{})
    var init = Object.assign(defaults.init, cfg.init||{})

    var paths = cfg.paths||{}
    paths.root = root
    paths.app            = Path.normalize(`${root}/${paths.app||'../../server/app.js'}`)
    paths.specs          = Path.normalize(`${root}/${paths.specs||'specs'}`)
    // paths.flavors        = path.flavors || Path.normalize(`${root}/${paths.flavors}`) || './flavors'
    if (paths.fixtures)  paths.fixtures = Path.normalize(`${root}/${paths.fixtures}`)
    if (paths.bson)      paths.bson = Path.normalize(`${root}/${paths.bson}`)
    if (paths.stories)   paths.stories = Path.normalize(`${root}/${paths.stories}`)

    if (cfg.mongo && cfg.mongo.seed)
      cfg.mongo.seed = Object.assign(defaults.mongo.seed, cfg.mongo.seed)

    var http = cfg.http || defaults.http

    return Object.assign(cfg, {init, colors, paths, stubs, http})
  }


  var inValid = validate(screamConfig)
  if (inValid) throw Error(`Invalid scream config: ${inValid.white} at ${root}/${src}`.red)


  return setDefaults(setCommandOptions(screamConfig))

}


module.exports = Configure
