var mongodb = require('mongodb')

module.exports = {

  Collections: {},

  Connect(cb) {
    mongodb.MongoClient.connect(config.mongoUri, (err, db) => {
      for (var name of ['Users']) {
        db.collection(name.toLowerCase(), (e, collection) =>
          this.Collections[name] = collection)
      }
      cb(err, this.Collections)
    })

  }

}

