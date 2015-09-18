module.exports = ({Path,Fs}, cfg, db) => ({


  fixture() {
    if (!cfg.paths.fixtures) return
    this.fixtures = {}
    Fs.readdirSync(cfg.paths.fixtures).forEach(file => {
      var fixtureName = file.split('.')[0]
      this.fixtures[fixtureName] = require(Path.join(cfg.paths.fixtures,file))
    })
    return this.fixtures
  },


  testToSeed(cb) {
    if (cfg.seed && cfg.seed.force)
      for (var colName in db.Collections) {
        console.log(`Mongo.Collection.Drop [${colName}] --force-seed`.seed)
        db.Collections[colName].drop()
      }
    else if (!cfg.seed)
      return cb(null, false)

    var {model,key} = cfg.seed
    var collectionName = (model+'s').toLowerCase()
    var collection = db.Collections[collectionName]
    if (!collection)
      throw Error(`DATA.testToSeed Failed. No app Collection ${collectionName}`)
    var fixture = this.fixtures[collectionName]
    if (!fixture)
      throw Error(`DATA.testToSeed Failed. No fixture ${collectionName}`)
    var seed = fixture[key]
    if (!seed)
      throw Error(`DATA.testToSeed Failed. No fixture object with key ${key}`)

    collection.findOne({_id:seed._id}, (e,r) => cb(e, r ? false : true))
  },


  restoreBSONData(cb) {
    var dir = cfg.paths.bson

    //-- Requires are inline for faster test suite running
    var {BSONPure}          = new require("bson")
    var BSON                = new BSONPure()

    var bsonFiles = Fs.readdirSync(dir).filter(f => f.indexOf('.bson') != -1)
    var last = bsonFiles.length, index = 0

    bsonFiles.forEach(function(bsonFile) {
      var bson = Fs.readFileSync(`${dir}/${bsonFile}`, { encoding: null })
      var docs = []
      var bsonIndex = 0
      while (bsonIndex < bson.length)
        bsonIndex = BSON.deserializeStream(bson,bsonIndex,1,docs,docs.length)

      var modelName = bsonFile.replace('s.bson','')
      console.log(`Mongo.BSON.Restoring [${modelName}] `.seed, docs.length)
      db.ensureDocs(modelName, docs, (e,r) => {
        if (e) {
          console.log('restoreBSONData.error'.error, e)
          return cb(e)
        }
        console.log(`Mongo.BSON.Restored [${modelName}]`.seed, `${++index}/${last}`)
        if (last === index) return cb(null)
      })
    })

  }


})
