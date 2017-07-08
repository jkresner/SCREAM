SCREAM          = require('../../lib/index')
appConfig       = require('./server/config')('test')

SCREAM().run (done) ->
  require('./server/app').run(appConfig, done)

