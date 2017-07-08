SCREAM = require('../../lib/index')({})

app = (done) ->
  config = require('./app/config')
  require('./app/app').run({config}, done)

SCREAM.run app
