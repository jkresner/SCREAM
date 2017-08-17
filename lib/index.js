var Fs                   = require('fs'),
    Path                 = require('path'),
    Log                  = require('./log'),
    Util                 = require('./_util'),
    Config               = require('./config'),
    Setup                = require('./setup'),
    Cmd                  = require('./cmd')

/**                                                                     SCREAM(
*  Initialize a SCREAM instance
*
*  Object      @opts[optional]
*    Object      .cmd Commander instance with parsed command line args piped to
                   mocha and used to override scream config
*    Object    .login opts
*    Object    .oauth fn to be used for test oauth
*    Function  .onReady fn hook after the app being tested + before tests start
/                                                                           )*/
module.exports = function(opts) {

  global.moment          = global.moment || require("moment")
  global.join            = global.join || Path.join
  global.deps            = { Fs, Path, Util, Setup }

  opts                   = opts||{}
  var cmd                = opts.cmd || Cmd()
  var cfg                = Config(deps, {cmd})
  var mocha              = opts.mocha || cfg.mocha
  var log                = Log({cmd,config:cfg})

  log.setup('SCREAM', `opts`)
  return {

    run(App = Util.App.empty) {
      log.setup('SETUP', `begin`)
      global.OPTS = assign(opts, { App, cmd, mocha, log, config:cfg })
      Setup.data(OPTS, Setup.runner(mocha))
    }
  }
}

/**                                                                     SCREAM(
* Use SCREAM.Commander to pass arguments / flags from command line which will
* be passed onto mocha (https://mochajs.org/#usage)
*
* Eg1. Use '--' to signal arguments via npm
*
*   npm test -- -g config --no-colors
*
*
* Eg2. Use node with harmony features required to run SCREAM
*
*   node test/ex1-js-emptyapp/index.js --no-colors
*
* Eg3. Use coffee with harmony features and verbose console output
*
*   coffee test/ex2-coffee/index.coffee -v
/                                                                           )*/
module.exports.Commander = Cmd
