global.join                  = require('path').join
global.moment                = require('moment')
global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect
global.assign                = Object.assign


describe('Framework', function() {

  before(function() {
    global.deps = { Util: require(join(process.cwd(), '/lib/_util')) }
    global.OPTS = {
      config: {
        log: { quiet: true, filter_fail: '' },
        setup: { ext: '.js' },
        paths: { fixtures: join(__dirname, 'lib', 'fixtures') }
      },
      log: { info() {}, flags() {} }
    }
  })

  describe('Config', require('./lib/specs/config'))
  describe('FIXTURE', require('./lib/specs/fixture'))
  describe('Slang', require('./lib/specs/slang'))
  describe('STUB', require('./lib/specs/stub'))
  describe('Http', require('./lib/specs/http'))  

})


// describe('Integration', function() {
// })
