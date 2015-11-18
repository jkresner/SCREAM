//-- Tests for SCREAM itself

global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect


describe('Framework Tests', function() {

  // describe('Data TODO', require('./lib/specs/data'))
  // describe('Db TODO', require('./lib/specs/db'))
  // describe('Etc. TODO', require('./lib/specs/etc.'))
  describe('Config', require('./lib/specs/config'))
  describe('Fixture', require('./lib/specs/fixture'))
  describe('Integration', require('./lib/specs/integration'))

})
