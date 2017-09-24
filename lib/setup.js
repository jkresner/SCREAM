module.exports = ({log}) => ({


  data(done) {
    log.step('data:db')
    global.DB = require('./db')(() => {
      let seeder = require('./db.seed')(DB, OPTS)
      seeder.testToSeed(y => y ? seeder.restoreBSONData(done) : done())
    })

    let ISODate = global.ISODate = str => moment(str).toDate()
    let ID = global.ID = global.ObjectId = (DB||{}).ObjectId

    log.step('data:fixture')
    global.FIXTURE = require('./data.fixture')

    if (!DB) done()

    return { ISODate, ID }
  },


  runner() {
    let Mocha = require('mocha')
    log.step('tests:init')
    return new Mocha(OPTS.config.mocha)
      .addFile(join(__dirname,'runner'))
      .run(status => {
        log.info('DONE', `${status==0?'No':'With'} errors\n`).flush()
        process.exit(status)
      })
  },


  app(done) {
    let start = new Date()
    log.step('app:init')

    global.APP = OPTS.App(function(e) {
      log.info('APP', `${e?'fail':'ready'} (${new Date()-start}ms)`).flush()
      log.step('tests:run')
      done(e)
    })
  },

  /*
    If unhandledPromiseRejection     f => Error, p => Profile
    If failed test / assertion       f => mocha.ctx, p => Error
  */
  fail(f, p) {
    // console.log('in fail....', f, p)
    if (f.stack)
      log.error(f)
    else if ((p instanceof Error))
      log.error(p)

    log.info('FAIL', `${log.step()} `.white + `${log.runner.scope.join(' > ')}`.spec)
    process.exit(1)  // Exiting stops default mocha exit output
  }

})
