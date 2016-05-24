module.exports = {


  data(done) {
    var start = new Date()
    global.DB = require('./db')(OPTS, () => {
      var seed = require('./db.seed')(DB)
      seed.testToSeed(ok => ok ? seed.restoreBSONData(done) : done())
    })
    global.DATA = require('./data')
    global.FIXTURE = require('./data.fixture')
    if (!DB) done()
  },


  app(done) {
    var start = new Date()
    global.APP = OPTS.App(function(e) {
      if (e) return done(e)
      if (OPTS.config.verbose) console.log(`    (${new Date()-start}ms)\n`.speed)
      done(null, APP)
    })
  }


}
