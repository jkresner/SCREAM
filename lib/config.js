function Config({Path}, root, appConfig) {


  var validate = (cfg) => {
    if (!cfg)
      return `Invalid Config: Config object required as first SCREAM parameter`
    if (!cfg.paths || !cfg.paths.root)
      return `Invalid Config: config.scream.path.root required, set it to __dirname`
    if (cfg.mongo) {
      if (!cfg.mongo.collections)
        return `Invalid Config: No mongo collections specified`
      if (!cfg.mongo.url)
        return `Invalid Config: MongoUrl not provided`

      cfg.seed = cfg.seed || cfg.mongo.seed
    }
    if (cfg.seed) {
      if (!cfg.seed.model || !cfg.seed.key)
        return `Invalid Config: Seed model name and key required`
      if (!cfg.paths.fixtures)
        return `Invalid Config: Fixtures path required with seed config set`
      if (!cfg.paths.bson)
        return `Invalid Config: BSON import path required with seed config set`
    }
  }

  var assignDefaults = (cfg) => {
    var {paths,specs} = cfg

    paths.app = Path.normalize(`${root}/${paths.app||'../../server/app.js'}`)
    paths.specs = Path.normalize(`${root}/${paths.specs||'specs'}`)

    paths.flavors = !paths.flavors ? './flavors'
                      : Path.normalize(`${root}/${paths.flavors}`)

    if (paths.fixtures)
      paths.fixtures = Path.normalize(`${root}/${paths.fixtures}`)
    if (paths.bson)
      paths.bson = Path.normalize(`${root}/${paths.bson}`)
    if (paths.stories)
      paths.stories = Path.normalize(`${root}/${paths.stories}`)

    if (cfg.seed) {
      if (!cfg.seed.clean && cfg.seed.clean !== false)
        cfg.seed.clean = true
      if (!cfg.seed.timeout)
        cfg.seed.timeout = 30000
    }

    if (!cfg.colors) cfg.colors = {}
    if (!cfg.colors.seed) cfg.colors.seed = 'green'
    if (!cfg.colors.spec) cfg.colors.spec = 'cyan'
    if (!cfg.colors.expectederr) cfg.colors.expectederr = ['magenta','dim']

    if (!cfg.stubs || !cfg.stubs.on === false)
      cfg.stubs = { on: true }

    if (!cfg.http || !cfg.http.api)
      cfg.http = Object.assign(cfg.http||{},{api:{}})

    return cfg
  }


  var cfg = require(Path.normalize(`${root}/scream.json`))

  cfg.paths = Object.assign(cfg.paths||{},{root})


  var inValid = validate(cfg)
  if (inValid)
    throw Error(inValid)


  // Double check running with acceptible test config...
  // Great for not using prod tokens, sending mail by mistake etc.
  if (cfg.appConfig && cfg.appConfig.expect)
    Object.keys(cfg.appConfig.expect).forEach(function(attr){
      if (cfg.appConfig.expect[attr] != appConfig[attr.split('.')])
        return `Invalid appConfig: expected value for ${attr} is ` + cfg.appConfig.expect[attr]
    })


  var cmd = require('commander')
    .version(require('../package.json').version)
    .usage('[options]')
    .option('-f, --force-seed', 'For BSON restore before running tests')
    .option('-d, --dirty-seed', 'Does not wipe existing collections on seed')
    .option('-s, --specs <specs>', 'Selectively compile and run one or more comma separated spec names')
    .parse(process.argv)

  if (cfg.seed && cmd.forceSeed)
    cfg.seed.force = true
  if (cfg.seed && cmd.dirtySeed)
    cfg.seed.clean = false
  if (cmd.specs)
    cfg.specs = cmd.specs

  return assignDefaults(cfg)


}


module.exports = Config
