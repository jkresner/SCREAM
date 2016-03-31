
config = require('./app/setup')('test').config
SCREAM = require('../../lib/index')(__dirname)
SCREAM.run({config})
