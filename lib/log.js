const start = new Date()
const pad = '                                                                   '

module.exports = function(opts) {

  let _info = ''
  let _step = 'scream:init'
  var {verbose,quiet,filter_fail} = opts.config.log
  require('colors').setTheme(opts.config.colors)

  Error.stackTraceLimit  = opts.config.log.stackTraceLimit || 10

  global.OI = function() {
    var args = [].slice.call(arguments)
    args.unshift('---!OI '.yellow.bold + (global.TEST||{title:'before'}).title.yellow.dim)
    args[1] = `\n${args[1]}\n`.yellow
    args.push('\n------'.yellow.bold)
    console.log.apply(this, args)
  }


  var runner = {
    pad: ' ',
    indent: desc => { runner.pad += '  ', DESC = desc },
    unpad: () => runner.pad = runner.pad.replace('  ',''),
    screamed: str => runner.pad + str.toUpperCase().spec,
    padded: str => runner.pad + str
  }

  return {

    error: e => {
      let stack = verbose ? e.stack : runner.pad+e.stack.split(')\n')
        .filter(ln => !filter_fail.test(ln))
        .slice(0, 15)
        .map(ln => ln.error
                     .replace(/at /g,'   ')
                     .replace('global.',''))
        .join('\n')

      console.log(`\n ${stack}`)
    },

    flags({rawArgs,options}) {
      if (quiet) return
      let ver = `(v${opts.about.version})`
      let flagOn = f => rawArgs.indexOf(f.long) - rawArgs.indexOf(f.short) != 0
      let flagList = options.map(f => flagOn(f) ? f.long : f.short.dim).join(' ')
      let fLen = options.map(f => flagOn(f) ? f.long : f.short).join(' ').length

      _info += `SCREAM ${flagList}${pad.substr(0,80-7-fLen-ver.length)}${ver}\n`.spec
    },

    runner,

    info(scope, data) {
      if (/FAIL/.test(scope))
        return console.log(`${_info} FAIL ${data.spec} (${new Date()-start}ms)\n\n`.error)

      if (opts.flags.quiet) return

      let elapse = verbose ? `(${new Date()-start}ms)` : ''
      let initTime = `✓ ${elapse}  `.substr(0,10).cyan.dim
      let prettyScope = ` ${scope}            `.substr(0,12).dim

      if (verbose)
        _info += `\n  ${initTime}${prettyScope}${data.init}`

      return {
        flush() {
          if (_info === '') return
          console.log(_info.replace(/^\n/,''))
          _info = ''
        }
      }
    },

    step(label) {
      if (label)
        _step = label
      return _step
    },

  }
}

