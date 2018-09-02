module.exports = function(cb) {

  var cfg        = OPTS.config.db
  if (!(cfg||{}).mongo) return


  var mongodb     = require('mongodb')
  var plural      = cfg.pluralize !== false ? 's' : ''
  var pluralize   = n => n.toLowerCase() + (n.match(/s$/i) ? '' : plural)

  var collection = modelName => {
    var name = pluralize(modelName.toLowerCase())
    var col = _db.Collections[name]
    if (col) return col
    throw Error(`SCREAM.db no ${name} in config.mongo.collections`)
  }


  var _db = {

    ObjectId: mongodb.ObjectId,

    Collections: {},

    docById(modelName, _id, cb) {
      if (typeof _id === 'string') _id = mongodb.ObjectId(_id)
      collection(modelName).findOne({_id}, (e,r) => cb(e||r) )
    },

    docsByQuery(modelName, query, cb) {
      collection(modelName).find(query).toArray( (e, r) => cb(e||r) )
    },

    removeDocs(modelName, query, cb) {
      collection(modelName).remove(query, (e,r)=>cb(e||r))
    },

    clear(modelName, cb) {
      collection(modelName).remove({}, e => cb(e))
    },

    //-- Adheres to schema specifications
    ensureDoc(modelName, doc, cb) {
      collection(modelName).remove({_id:doc._id}, (ee, rr) => {
        collection(modelName).insertOne(doc, {new:true}, (e, r) => {
          cb(ee||e, r ? r.ops[0] : console.log(`ensureDoc.${modelName} failed: ${e.message}`.error))
        })
      })
    },

    //-- Disregards schema specifications / validations rules (often useful)
    ensureDocs(modelName, docs, cb) {
      var upserts = docs.map(
        u => ({ updateOne: { q: {_id:u._id}, u, upsert: true } }) )

      collection(modelName).bulkWrite(upserts, {ordered:false}, cb)
    },

  }

  mongodb.MongoClient.connect(cfg.mongo.url, (e, client) => {
    if (e) throw e
    let db = client.db(cfg.mongo.dbName)
    let collections = cfg.mongo.collections.map(name=>pluralize(name))    
    for (let name of collections) 
      db.collection(name, (e, col) => _db.Collections[name] = col)
    
    OPTS.log.info('DB', `${collections.join(' ')}`)
    OPTS.log.info('MONGO', `${cfg.mongo.url}`)
    cb()
  })

  return _db
}
