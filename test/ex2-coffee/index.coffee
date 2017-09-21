SCREAM = require('../../lib/index')({})

App = (done) ->
  config = require('./app/config')
  require('./app/app').run({config}, done)

SCREAM.run App
