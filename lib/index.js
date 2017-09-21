var Fs                   = require('fs'),
    Path                 = require('path'),
    about                = require('../package.json'),
    Config               = require('./config'),
    Log                  = require('./log'),
    Setup                = require('./setup'),
    Util                 = require('./_util')

/**                                                                     SCREAM(
*  Get a SCREAM instance configured by provided opts
*
*  Object      @opts[optional]
*    Object      .flags features available to command line
*    Object      .setup opts
*      Object      .done runs on app completion
*    Object      .login fn to be used for test login
*    Object      .oauth fn to be used for test oauth
/                                                                           )*/
module.exports = function(opts={}) {

  global.join            = global.join || Path.join
  global.moment          = global.moment || require("moment")
  global.deps            = { Fs, Path, Util }

  opts.about             = about
  opts.config            = Config(deps, opts)

  let log                = Log(opts)
  log.flags(opts.flags)
  log.info('SCREAM', `instance configured`)

  return {
    run(App = Util.App.empty) {
      let setup = assign(Setup({log}),opts.setup||{})
      global.OPTS = assign(opts, { App, log, setup })
      global.DATA = setup.data(() =>
        setup.runner().on('fail', setup.fail))
    }
  }

}
