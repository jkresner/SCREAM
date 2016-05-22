var Mocha               = require('mocha'),
    Colors              = require('colors'),
    Fs                  = require('fs'),
    Path                = require('path'),
    Util                = require('./_util')
    Config              = require('./config'),
    Cmd                 = require('./cmd'),
    Instrument          = require('./_util.instrument')

global.deps             = { Colors, Fs, Path, Util }
global.OPTS             = null

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
  OPTS.cmd     = OPTS.cmd||Cmd()
  OPTS.config  = Config(deps, OPTS)
  OPTS.$logIt  = Instrument(deps, OPTS).conditonalLog

  return {
    run(App) {
      OPTS.App = App
      new Mocha(config.mocha)
        .addFile(Path.join(__dirname , 'runner'))
        .run(f => {
          OPTS.$logIt('DONE', `${f}\n\n`)
          // process.exit(f)
        })
        .on('fail', (f) => {
          OPTS.$logIt('DONE', `FAIL => ${f.err.message}\n\n`.gray +
              _.take(f.err.stack.split('\n').filter(ln => ln), 15) // !ln.match(new RegExp(config.init.fail.filter,'i'))), 15)
               .map(ln => ln.red)
               .join('\n')+'\n')

          // if (f.async != 1)
          process.exit(f==null?0:1)
        })
        // .on ('end', f => {
        // console.log('MOCHA.end'.yellow, f)
        // process.exit(f==null?0:1) })
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
