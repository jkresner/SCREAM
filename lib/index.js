var Mocha               = require('mocha')
var Colors              = require('colors')
var Fs                  = require('fs')
var Path                = require('path')
var Cmd                 = require('./cmd')
var Config              = require('./config')
var Instrument          = require('./_util.instrument')
var Util                = require('./_util')


var deps = { Colors, Fs, Path, Util }


/**                                                                     SCREAM(
* Initialize an instance of SCREAM with
*
* String     @root path prepended to other paths inc. specs & the app to test
* Object     @opts[optional]
*   Object     .cmd instance of Commander with parsed args from command line
*                to be used by both SCREAM and Mocha
*   Function   .login fn to be used for test login
*   Function   .oauth fn to be used for test oauth
*   Function   .onReady fn executed before tests, once the app being tested
*                is fully initialized
/                                                                           )*/
module.exports = function(root, opts) {

  opts         = Object.assign(opts||{},{root})
  opts.cmd     = opts.cmd||Cmd()
  opts.config  = Config(deps, opts) // scream config / rather than app config
  opts.$logIt  = Instrument(deps, opts).conditonalLog

  // console.log(opts.cmd)

  return {
    opts,
    run(appOpts) {

      global._RUNNER = { deps, opts,
        onInit(done) {
          require('./app.init')(deps, opts).run.call(this, appOpts, done)
        }
      }

      new Mocha(Object.assign({bail:true}, opts.cmd))
        .addFile(Path.join(__dirname , 'runner'))
        .run(failures => {
          // console.log('TESTS.failures'.yellow, failures)
        })
        .on ('fail', f => {
          // console.log('MOCHA.Fail'.yellow, f)
        })
        .on ('end', f => {
          // console.log('SCREAM.end'.yellow, f)
          // cb ? cb(f) :
          process.exit(f)
        })
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
