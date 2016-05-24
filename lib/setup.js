module.exports = {


  data(done) {
    var start = new Date()
    global.DB = require('./db')(OPTS, () => {
      var seeder = require('./db.seed')(DB)
      seeder.testToSeed(seed => seed ? seeder.restoreBSONData(done) : done())
    })
    global.DATA = require('./data')
    global.FIXTURE = require('./data.fixture')
    if (!DB) done()
  },


  app(done) {
    var start = new Date()
    global.APP = OPTS.App(function(e) {
      if (e) return done(e)
      OPTS.log.setup('APP', `READY (${new Date()-start}ms)`)
      done(null, APP)
    })
  }


}
