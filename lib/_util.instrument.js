module.exports = function({Colors}, opts) {


  Colors.setTheme(opts.config.colors)

  var {verbose,muted} = opts.config

  return {
    conditonalLog(scope, data) {

      var prettyScope = `  SCREAM._        `
      prettyScope = prettyScope.replace('_', scope).slice(0, 16).spec
      if (scope == 'Output' && (muted || verbose))
        console.log(prettyScope, `${muted ? 'muted' : 'verbose'}`)
      else if (scope == 'Seeding')
        console.log(prettyScope, data)
      else if (verbose)
        console.log(prettyScope, data)
    }

  }
}

