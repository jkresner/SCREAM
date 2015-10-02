 function run(config, cb) {

  var express                = require(`express`)
  var app                    = express()

  if (cb) cb()

  return app
}


module.exports = { run }
