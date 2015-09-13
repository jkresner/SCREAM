var mongodb     = require('mongodb')
var {ObjectId}  = mongodb
var ISODate     = Date


module.exports = function({}, cfg, callback) {

  var Collections = {}
  var collection = name => Collections[name.toLowerCase()]

  var _db = {

    Collections,
    ObjectId,
    ISODate,


    docById(modelName, _id, cb) {
      if (typeof _id === 'string') _id = ObjectId(_id)
      collection(modelName).findOne({_id}, (e,r) => cb(r) )
    },


    docsByQuery(modelName, query, cb) {
      collection(modelName).find(query).toArray((e, r) => cb(r))
    },


    ensureDoc(modelName, doc, cb) {
      collection(modelName).remove({_id:doc._id}, function(e, r) {
        collection(modelName).insertOne(doc, {new:true}, function(ee,doc) {
          cb(ee,(doc)?doc.ops[0]:null)
        })
      })
    },


    ensureDocs(modelName, docs, cb) {
      var ordered = false
      var upsert = true

      var upserts = docs.map( update => {
        var q = {_id:update._id}
        return { updateOne: { q, u:update, upsert } }
      })

      collection(modelName).bulkWrite(upserts, {ordered}, cb)
    },


    removeDocs(modelName, query, cb) {
      collection(modelName).remove(query, cb)
    }

  }

  if (!cfg.mongo) return callback(null, _db)

  mongodb.MongoClient.connect(cfg.mongo.url, (ee, db) => {
    if (ee) return callback(ee)
    for (var name of cfg.mongo.collections.map(n=>n.toLowerCase()))
      db.collection(name, (e, c) => Collections[name] = c )
    callback(null, _db)
  })
}