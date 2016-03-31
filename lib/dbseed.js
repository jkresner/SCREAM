module.exports = ({Path,Fs,Util}, opts, db) => ({

  testToSeed(cb) {
    var cfg = opts.config.mongo

    if (!cfg || !cfg.seed)
      return cb(null, false)

    if (cfg.seed.force)
      return cb(null, true)

    // mode == 'FIXTURE' only for now
    var [mode,fixtureName,key] = cfg.seed.without.split('.')
    opts.$logIt('CHECKING', `seed.without FIXTURE.${fixtureName}.${key}`)

    var fixture = FIXTURE[fixtureName]
    if (!fixture)
      throw Error(`testToSeed Failed. Fixture ${fixtureName} not defined`)

    var seed = fixture[key]
    if (!seed)
      throw Error(`testToSeed Failed. No object at FIXTURE.${fixtureName}.${key} defined`)

    if (seed._id.constructor === String)
      console.log(`DATA.warn: did you mean for ${key}._id to be of type String?`.yellow)

    var collection = db.Collections[fixtureName.toLowerCase()]
    if (!collection)
      throw Error(`testToSeed Failed. Collection ${collectionName} not found`)

    collection.findOne({_id:seed._id}, (e,r) => cb(e, r==null))

  },


  restoreBSONData(cb) {

    //-- Requires are inline for faster test suite running
    var {BSONPure}             = new require("bson")
    var BSON                   = new BSONPure()
    var {dirty,force,timeout}  = opts.config.mongo.seed

    TIMEOUT(timeout)
    opts.$logIt('SEEDING', `${force?'forced ':''}${dirty===false?"clean/overwrite":"dirty/upsert"} | ${timeout}ms`)

    var dir = opts.config.paths.bson
    var bsonFiles = Fs.readdirSync(dir).filter(f => f.match('.bson'))

    var idx = 0, last = bsonFiles.length

    // //--
    // // for (var name in overwrite ? db.Collections || [])
    // //   if (collectionNames.indexOf(name) == -1) {
    // //     opts.$logIt('SEEDING', `Collection.Drop --force-seed`.seed, name)
    // //     db.Collections[name].drop()
    // //   }

    bsonFiles.map(f => f.replace('.bson','')).forEach(name => {

      var done = e => {
        opts.$logIt('WRITTEN', e ? e : `[${name}] (${++idx}/${last})`)
        if (e || idx==last) cb(e)
      }

      // var modelName = fileName.replace('s.bson','')
      var collection = db.Collections[name]

      var bson = Fs.readFileSync(`${dir}/${name}.bson`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      opts.$logIt('IMPORT', `[${name}] ${docs.length} docs`)
      if (dirty === false)
        collection.drop((e,r) => {
          opts.$logIt('OVERWRITE', `Collection.Drop [${name}] --force-seed`)
          collection.insert(docs, done)
        })
      else
        db.ensureDocs(name, docs, done)
    })
  }

})
