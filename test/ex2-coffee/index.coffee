SCREAM          = require('../../index')
appConfig       = require('./app/setup')('test').config


SCREAM(__dirname, appConfig).run()