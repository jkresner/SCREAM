module.exports = {


  data(opts, done) {
    var start = new Date()
    OPTS.log.setup('DATA', '.')

    global.DB = require('./db')(opts, () => {
      var seeder = require('./db.seed')(DB)
      seeder.testToSeed(seed => seed ? seeder.restoreBSONData(done) : done())
    })

    global.moment = global.moment || require("moment")
    global.DATA = {}
    DATA.ISODate = global.ISODate = str => moment(str).toDate()
    DATA.timeSeed = timeSeed = prfx => (prfx||'')+moment().format('X')
    DATA.ID = global.ID = global.ObjectId = (DB||{}).ObjectId

    global.FIXTURE = require('./data.fixture')

    if (!DB) done()
  },


  runner(opts) {
    return function() {
      var log = OPTS.log
      var Mocha = require('mocha')
      return new Mocha(opts.mocha)
        .addFile(opts.rootFile)
        .run( status => {
          status == 0 ? process.exit(log.setup('DONE', 'No errors\n\n')||0)
                    : log.setup('DONE', status) })
        .on('fail', f => {
          if ((f||{}).err) console.log('runner.fail'.dim.yellow, f.err.message.magenta, "\n")
          // if (f.err.message.match(/Syntax/))
          // console.log(f.err.message, f.err.stack)
          process.exit(f ? log.setup('FAIL\n\n', log.error(f.err)+'\n\n') || 1 : 0)
        })
          // if (f.async != 1)
        // .on ('end', f => { console.log('MOCHA.end'.yellow, f) process.exit(f==null?0:1) })
      }
  },


  app(done) {
    var start = new Date()
    global.APP = OPTS.App(function(e) {
      if (e) return done(e)
      OPTS.log.setup('APP', `ready (${new Date()-start}ms)`)
      done(null, APP)
    })
  }


}
