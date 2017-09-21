module.exports = (db, {log}) => ({

  testToSeed(cb) {
    let cfg = OPTS.config.db.seed

    if (!cfg)
      return cb(null, false)

    var mode = cfg.dirty ? "dirty(upsert)" : "clean(overwrite)"

    if (cfg.force) {
      log.info('SEEDING', `forced ${mode}`)
      return cb(true)
    }

    // mode == 'FIXTURE' only for now
    var [mode,fixtureName,key] = cfg.without.split('.')
    var seedStr = `FIXTURE.${fixtureName}.${key}`

    var fixture = FIXTURE[fixtureName]
    if (!fixture)
      throw Error(`testToSeed fail. FIXTURE.${fixtureName} not defined`)

    var seed = fixture[key]
    if (!seed)
      throw Error(`testToSeed fail. ${seedStr} not defined`)

    if (seed._id.constructor === String)
      console.log(`DATA.warn: ${seedStr}._id is of type String?`.yellow)

    var collection = db.Collections[fixtureName.toLowerCase()]
    if (!collection)
      throw Error(`testToSeed fail. Collection ${fixtureName.toLowerCase()} not found`)

    collection.findOne({_id:seed._id}, (e,r) => {
      if (e) throw e
      log.info('DBSEED', r ? `skip (${seedStr} in DB)`
                               : `${mode} (${seedStr} no found in DB)`)
      cb(r==null)
    })
  },


  restoreBSONData(cb) {
    log.step('data:seed')

    //-- Requires are inline for faster test suite running
    var {BSONPure}             = new require("bson")
    var BSON                   = new BSONPure()
    var {dirty,force}          = OPTS.config.db.seed

    var dir = OPTS.config.paths.bson
    var bsonFiles = deps.Fs.readdirSync(dir).filter(f => f.match('.bson'))

    var idx = 0, last = bsonFiles.length

    // console.log('restoreBSONData', dirty, force)
    for (var name in db.Collections)
      // if (collectionNames.indexOf(name) == -1) {
        log.info('SEEDING', `[${name}].drop --db-seed`.seed, )
        // db.Collections[name].drop()
      // }

    bsonFiles.map(f => f.replace('.bson','')).forEach(name => {

      var collection = db.Collections[name]

      var bson = deps.Fs.readFileSync(`${dir}/${name}.bson`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      var done = docs => e => {
        log.info('IMPORTED', e ? `${name} fail: ${e.message}` : `${++idx}/${last} ${name}[${docs.length}]`)
        if (e || idx==last) cb(e)
      }

      log.info('IMPORT', `${name}[${docs.length}]`)
      if (dirty === false)
        collection.drop((e,r) => {
          log.info('OVERWRITE', `Collection.Drop [${name}] --db-seed`)
          collection.insert(docs, done(docs))
        })
      else
        db.ensureDocs(name, docs, done(docs))
    })
  }

})
