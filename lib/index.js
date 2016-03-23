var Mocha      = require('mocha')
var Colors     = require('colors')
var Cmd        = require('./cmd')
var Fs         = require('fs')
var Path       = require('path')
var Util       = require('./_util')



module.exports = function(root, opts) {

  var deps     = { Fs, Path, Util }

  opts         = Object.assign(opts || {},{root})
  opts.cmd     = opts.cmd||Cmd()
  opts.Config  = require('./config')(deps, opts) //-- scream config (not app config)
  opts.$logIt  = deps.Util.Instrument(opts.Config).$logIt

  Colors.setTheme(opts.Config.colors)

  return {
    config: opts.Config,
    run(appOpts, cb) {

      global._RUNNER = {
        deps, opts,
        onInit(done) {
          require('./app.init')(deps, opts).run.call(this, appOpts, done)
        }
      }

      var mocha = new Mocha({ bail:true, grep: opts.cmd.grep })
      mocha.addFile(__filename.replace('index','runner'))
      mocha.run( failures => {})
           .on ('fail', f => {})
           .on ('end', f => cb ? cb(f) : process.exit(f) )

    }
  }

}

module.exports.Commander = Cmd
