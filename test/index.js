require('../lib/flavors')
var Scream    = require('../index.js')
var Path      = require('path')
var deps      = {Scream,Path}


//-- Tests for SCREAM framework
describe('Framework Tests', function() {

  describe('Config', require('./framework/spec/config')(deps))

})
