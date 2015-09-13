function Config({Path}, root, appConfig) {


  var validate = (cfg) => {
    if (!cfg)
      return `Invalid Config: Config object required as first SCREAM parameter`
    if (!cfg.paths || !cfg.paths.root)
      return `Invalid Config: config.scream.path.root required, set it to __dirname`
    if (cfg.mongo) {

      if (!cfg.mongo.collections)
        return `Invalid Config: No mongo collections specified`
      if (!appConfig || !appConfig[cfg.mongo.url.appConfig])
        return `Invalid Config: MongoUrl must be referenced from app config object`
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

    paths.app = Path.normalize(`${root}/${paths.app||'../server/app.js'}`)
    paths.specs = Path.normalize(`${root}/${paths.specs||'specs'}`)

    paths.flavors = !paths.flavors ? './lib/flavors'
                      : Path.normalize(`${root}/${paths.flavors}`)

    if (paths.fixtures)
      paths.fixtures = Path.normalize(`${root}/${paths.fixtures}`)

    if (cfg.mongo)
      cfg.mongo.url = appConfig[cfg.mongo.url.appConfig]

    if (cfg.seed) {
      if (!cfg.seed.timeout)
        cfg.seed.timeout = 30000
    }

    if (!cfg.colors) cfg.colors = {}
    if (!cfg.colors.seed) cfg.colors.seed = 'green'
    if (!cfg.colors.spec) cfg.colors.spec = 'cyan'
    if (!cfg.colors.expectederr) cfg.colors.expectederr = ['magenta','dim']

    return cfg
  }


  var cfg = require(Path.normalize(`${root}/config.json`))
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


  return assignDefaults(cfg)


}


module.exports = Config
