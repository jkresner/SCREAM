SCREAM          = require('../../lib/index')
appConfig       = require('./server/config')('test')


SCREAM(__dirname).run(appConfig)
