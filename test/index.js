//-- Tests for SCREAM itself
var {join}                   = require('path')
global.moment                = require('moment')
global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect


describe('Framework Tests', function() {

  before(function() {
    global.OPTS = { config: { paths: { codeExt: '.js' } } }
    OPTS.log = { setup() {} }
    OPTS.config.paths.fixtures = join(__dirname, 'lib', 'fixtures')
  })


// describe('TODO Config', require('./lib/specs/config'))
// describe('TODO Data', require('./lib/specs/data'))
// describe('TODO Db', require('./lib/specs/db'))
  describe('FIXTURE', require('./lib/specs/fixture'))

})

describe('Integration', function() {
  // describe('TODO Integration', require('./lib/specs/integration'))
  // })

})
