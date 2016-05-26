const start = new Date()
const pad = '                                                                   '

module.exports = function(opts) {
  var {verbose,terse,colors} = opts.config
  require('colors').setTheme(colors)


  if (!terse) {
    // var package = // require('../package.json')
    var ver = `(v0.6.4)`//`(v${package.version})`
    var info = !verbose ? '' : `\nhttps://scream.test/guide
https://github.com/jkresner/SCREAM/issues\n`.dim

    var {rawArgs,options} = opts.cmd
    var flagOn = f => rawArgs.indexOf(f.long) - rawArgs.indexOf(f.short) != 0
    var flags = options.map(f => flagOn(f) ? f.long : f.short.dim).join(' ')
    var fLen = options.map(f => flagOn(f) ? f.long : f.short).join(' ').length

    console.log(`SCREAM ${flags}${pad.substr(0,80-7-fLen-ver.length)}${ver}${info}`.spec)
  }

  var runner = {
    pad: '  ',
    indent: () => runner.pad += '  ',
    unpad: () => runner.pad = runner.pad.replace('  ',''),
    screamed: str => runner.pad + str.toUpperCase().spec,
    padded: str => runner.pad + str
  }

  return {

    error: e => e.stack.split('\n')
      .filter(ln => true) // !ln.match(new RegExp(config.init.fail.filter,'i'))), 15)
      .slice(0, 15)
      .map(ln => ln.error)
      .join('\n').error,

    runner,

    setup(scope, data) {

      var elapse = verbose ? `(${new Date()-start}ms)` : ''
      var initTime = `✓ ${elapse}  `.substr(0,10).cyan.dim
      var prettyScope = ` ${scope}            `.substr(0,12).dim

      if (scope == 'Output' && (terse || verbose))
        console.log(prettyScope, `${muted ? 'muted' : 'verbose'}`)
      else if (scope == 'Seeding')
        console.log(prettyScope, `${data}`.seed)
      else if (verbose)
        console.log(`  ${initTime}${prettyScope}${data}`.init)


    }

  }
}

