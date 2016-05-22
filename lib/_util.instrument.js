module.exports = function(deps, opts) {

  deps.Colors.setTheme(opts.config.colors)

  var {verbose,muted} = opts.config

  var package  = require('../package.json')
  var args = opts.cmd.rawArgs
  var flagOn = f => args.indexOf(f.long) - args.indexOf(f.short) != 0
  var flagsOn = opts.cmd.options.map(f => flagOn(f) ? f.long : f.short.dim).join(' ')
  var flags = opts.cmd.options.map(f => flagOn(f) ? f.long : f.short).join(' ')
  var ver = `(v${package.version})`
  while (flags.length + ver.length < 73) ver = ' '+ver
  console.log(`\n\nSCREAM ${flagsOn}${ver}`.spec)

  var guide = `https://scream.test/guide                                                           \n`
  var issues = `https://github.com/jkresner/SCREAM/issues                                          \n`
  if (verbose) console.log(`${guide}${issues}`.spec.dim)

  return {

    conditonalLog(scope, data) {

      var prettyScope = `  SCREAM._        `
      prettyScope = prettyScope.replace('_', scope).slice(0, 18).init.dim

      if (scope == 'Output' && (muted || verbose))
        console.log(prettyScope, `${muted ? 'muted' : 'verbose'}`)
      else if (scope == 'Seeding')
        console.log(prettyScope, `${data}`.seed)
      else if (verbose)
        console.log(prettyScope, `${data}`.init)
    }

  }
}

