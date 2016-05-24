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
      OPTS.log.setup('APP', `READY (${new Date()-start}ms)`)
      done(null, APP)
    })
  }


}
