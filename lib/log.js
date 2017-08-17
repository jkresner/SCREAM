const start = new Date()
const pad = '                                                                   '

module.exports = function(opts) {
  var {verbose,quiet,colors,setup} = opts.config
  require('colors').setTheme(colors)

  Error.stackTraceLimit  = opts.config.stackTraceLimit || 10

  global.OI = function() {
    var args = [].slice.call(arguments)
    args.unshift('---!OI '.yellow.bold + (global.TEST||{title:'before'}).title.yellow.dim)
    args[1] = `\n${args[1]}\n`.yellow
    args.push('\n------'.yellow.bold)
    console.log.apply(this, args)
  }

  if (!quiet) {
    // var package = // require('../package.json')
    var ver = `(v0.7.2)`//`(v${package.version})`
    var info = ''
    // var info = !verbose ? '' : `\nhttps://scream.test/guide

    var {rawArgs,options} = opts.cmd
    var flagOn = f => rawArgs.indexOf(f.long) - rawArgs.indexOf(f.short) != 0
    var flags = options.map(f => flagOn(f) ? f.long : f.short.dim).join(' ')
    var fLen = options.map(f => flagOn(f) ? f.long : f.short).join(' ').length

    console.log(`SCREAM ${flags}${pad.substr(0,80-7-fLen-ver.length)}${ver}${info}`.spec)
  }

  var runner = {
    pad: ' ',
    indent: (desc) => { runner.pad += '  ', DESC = desc },
    unpad: () => runner.pad = runner.pad.replace('  ',''),
    screamed: str => runner.pad + str.toUpperCase().spec,
    padded: str => runner.pad + str
  }

  return {

    error: e =>
      e.stack.split(')\n')
             .filter(ln => !setup.fail.filter.test(ln))
             .slice(0, 15)
             .map(ln => ln.error.replace(/at /g,'  ') ) //.replace(/(\)|\(|\/Users)/g,''))
             .join('\n'),

    runner,

    setup(scope, data) {

      var elapse = verbose ? `(${new Date()-start}ms)` : ''
      var initTime = `✓ ${elapse}  `.substr(0,10).cyan.dim
      var prettyScope = ` ${scope}            `.substr(0,12).dim

      if (scope == 'Output' && (quiet || verbose))
        console.log(prettyScope, `${quiet ? 'quiet' : 'verbose'}`)
      else if (scope == 'Seeding')
        console.log(prettyScope, `${data}`.seed)
      else if (verbose)
        console.log(`  ${initTime}${prettyScope}${data}`.init)


    }

  }
}

