const dflt     = require('./config.defaults.json')
const flags    = require('./config.flags')
const ext      = /\.(js|coffee)$/

module.exports = function({Path}, opts={}) {

  let flg      = flags(opts)
  let dir      = Path.dirname(process.mainModule.filename)
  let json     = require(join(dir, `${flg.config||'scream'}.json`))

  let colors   = assign({}, dflt.colors, json.colors||{})
  let http     = assign({}, dflt.http, json.http||{})
  let mocha    = assign({}, dflt.mocha, opts.mocha||{})
  let log      = assign({}, dflt.log, json.log||{})
  log.filter_fail = new RegExp(log.filter_fail)
  let stubs    = assign({}, dflt.stubs, json.stubs)
  let setup    = assign({ext}, dflt.setup, json.setup||{}, opts.setup||{})
  let paths    = { app: dir, specs: join(dir, 'specs') }
  for (let fldr in json.paths) paths[fldr] = join(dir, json.paths[fldr])

  if (json.mongo) {
    if (json.mongo.seed)
      var seed = assign({}, dflt.db.seed, json.mongo.seed)
    let mongo = assign({}, dflt.db.mongo, json.mongo)
    delete mongo.seed
    let e
    if (!mongo.collections) e = `No mongo collections specified`
    if (!mongo.url) e = `Mongo url not provided`
    if (seed) {
      if (!paths.fixtures) e = `.paths.fixtures dir needed with mongo.seed`
      if (!paths.bson) e = `.paths.bson import dir needed with mongo.seed`
      if (!seed.without) e = `.db.seed.without "trigger" needed with mongo.seed`
      if (!seed.without.match(/^FIXTURE\./)) e = `.db.seed.without currently supports only FIXTURE`
    } else {
      if (flg.dbSeed) e = `db.seed settings required with --db-seed flag`
      if (flg.dbSeedDirty) e = `db.seed settings required with --db-seed-dirty flag`
    }
    if (e) throw Error(e)
    var db = assign({mongo},seed?{seed}:{})
  }

  let specs = flg.only || dflt.specs
  if (flg.grep) mocha.grep = flg.grep
  if (flg.dbSeed || flg.dbSeedDirty) seed.force = true
  if (flg.dbSeedDirty) seed.dirty = true
  if (flg.unstub) stubs.on = false
  if (flg.env) process.env[`ENV`] = flg.env
  if (flg.logFlag) { log.flag = flg.logFlag
        process.env[`LOG_IT_${flg.logFlag}`] = 'white' }

  if (flg.verbose) {
    log.verbose = true
    process.env[`LOG_VERBOSE`] = 'white'
  } else if (flg.quiet) {
    log.quiet = true
    process.env[`LOG_QUIET`] = 'gray'
  }

  return assign( db?{db}:{},
    { colors, http, mocha, log, paths, setup, specs, stubs })

}
