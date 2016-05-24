var Mocha               = require('mocha'),
    Colors              = require('colors'),
    Fs                  = require('fs'),
    Path                = require('path'),
    Util                = require('./_util'),
    Config              = require('./config'),
    Setup               = require('./setup'),
    Cmd                 = require('./cmd'),
    Instrument          = require('./_util.instrument')

global.deps             = { Colors, Fs, Path, Util, Setup }
global.OPTS             = null


var startSuite = (opts, log) =>
  new Mocha(opts)
    .addFile(opts.rootFile)
    .run( failed =>
      process.exit(log.setup('DONE', `${failed==0?'No errors':failed}\n\n`) || failed) )
    .on('fail', f =>
      process.exit(f ? log.setup('FAIL\n\n', log.error(f.err)+'\n\n') || 1 : 0) )
// if (f.async != 1)
// .on ('end', f => { console.log('MOCHA.end'.yellow, f) process.exit(f==null?0:1) })


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

  OPTS         = opts||{}
  OPTS.cmd     = opts.cmd||Cmd()
  OPTS.config  = Config(deps, OPTS)
  OPTS.log     = Instrument(deps, OPTS)

  return {
    run(App) {
      OPTS.App = App || Util.App.empty
      Setup.data( e => startSuite(OPTS.config.mocha, OPTS.log) )
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
*   node --harmony-destructuring test/ex1-js-emptyapp/index.js --no-colors
*
* Eg3. Use coffee with harmony features and verbose console output
*
*   coffee --nodejs '--harmony_destructuring' test/ex2-coffee/index.coffee -v
/                                                                           )*/
module.exports.Commander = Cmd
