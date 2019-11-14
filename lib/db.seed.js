module.exports = (db, {log}) => ({

  testToSeed(cb) {
    let cfg = OPTS.config.db.seed
    if (!cfg)
      return cb(null, false)

    if (cfg.force) {
      log.info('SEEDING', `forced ${cfg.dirty ? "dirty" : "clean"}`)
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
                           : `${mode} (${seedStr} not in DB)`)
      cb(r==null)
    })
  },


  restoreBSONData(cb) {
    log.step('data:seed')

    //-- Requires are inline for faster test suite running
    const BSON                 = require("bson")
    var {dirty,force}          = OPTS.config.db.seed


    let dir = OPTS.config.paths.bson
    let bsonFiles = deps.Fs.readdirSync(dir).filter(f => f.match('.bson'))
    let idx = 0, last = bsonFiles.length

    // ** might have to drop collections not in .bson file set
    // console.log('restoreBSONData', dirty, force)
    // for (let name in db.Collections)
      // if (collectionNames.indexOf(name) == -1) {
        // log.info('SEED, `[${name}].drop --db-seed`.seed, )
        // db.Collections[name].drop()
      // }

    bsonFiles.map(f => f.replace('.bson','')).forEach(name => {
      let collection = db.Collections[name]
      let bson = deps.Fs.readFileSync(`${dir}/${name}.bson`, { encoding: null })
      let docs = []
      let bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      var done = docs => e => {
        log.info('SEEDED', e ? `${name} fail: ${e.message}` : `${++idx}/${last} ${name}[${docs.length}]`).flush()
        if (e || idx==last) cb(e)
      }

      let op = dirty === false ? ` [${name}].drop().insertMany` : `-dirty [${name}].upsert`
      log.info('SEED', `--db-seed${op}([${docs.length}])`.seed).flush()
      if (dirty === false)
        collection.drop((e,r) => collection.insertMany(docs, done(docs)))
      else
        db.ensureDocs(name, docs, done(docs))
    })
  }

})
