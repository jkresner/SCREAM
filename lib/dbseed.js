module.exports = ({Path,Fs,Util}, cfg, db) => ({

  testToSeed(cb) {
    if (!cfg.seed)
      return cb(null, false)

    if (cfg.seed.force)
      return cb(null, true)

    var {model,key} = cfg.seed
    var collectionName = (model+'s').toLowerCase()
    var collection = db.Collections[collectionName]
    if (!collection)
      throw Error(`DATA.testToSeed Failed. No app Collection ${collectionName}`)
    var fixture = FIXTURE[collectionName]
    if (!fixture)
      throw Error(`DATA.testToSeed Failed. No fixture ${collectionName}`)
    var seed = fixture[key]
    if (!seed)
      throw Error(`DATA.testToSeed Failed. No fixture object with key ${key}`)

    if (seed._id.constructor === String)
      console.log(`DATA.Seed.warn: did you mean for ${key}._id to be of type String?`)

    collection.findOne({_id:seed._id}, (e,r) => cb(e, r ? false : true))
  },


  restoreBSONData(cb) {
    //-- Requires are inline for faster test suite running
    var {BSONPure}          = new require("bson")
    var BSON                = new BSONPure()

    var dir = cfg.paths.bson
    var bsonFiles = Fs.readdirSync(dir).filter(f => f.indexOf('.bson') != -1)
    var collectionNames = bsonFiles.map(f => f.replace('.bson',''))
    var last = bsonFiles.length, index = 0

    if (cfg.seed.clean)
      for (var name in db.Collections) {
        if (collectionNames.indexOf(name) == -1) {
          console.log(`  SCREAM.Mongo.Collection.Drop --force-seed`.seed, name)
          db.Collections[name].drop()
        }
      }

    bsonFiles.forEach(function(fileName) {
      var modelName = fileName.replace('s.bson','')
      var collection = db.Collections[modelName+'s']

      var done = (e,r) => {
        if (e) {
          console.log('  SCREAM.restoreBSONData.error'.error, e)
          return cb(e)
        }
        console.log(`  SCREAM.Mongo.BSON.Restored [${modelName}s]`.seed, `${++index}/${last}`)
        if (last === index) return cb(null)
      }

      var bson = Fs.readFileSync(`${dir}/${fileName}`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      console.log(`  SCREAM.Mongo.BSON.Restoring [${modelName}s] `.seed, docs.length)
      if (cfg.seed.clean)
        collection.drop((e,r) => {
          console.log(`  SCREAM.Mongo.Collection.Drop [${modelName}s] --force-seed`.seed)
          collection.insert(docs, done)
        })
      else
        db.ensureDocs(modelName, docs, done)
    })
  }

})
