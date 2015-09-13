function Runner({Path,Fs}, cfg) {

  var runAll = !cfg.specs || cfg.specs == 'all'

  var specs = Fs.readdirSync(cfg.paths.specs)
                .map(f => f.split('.')[0])


  global.SPEC = function(name) {
    if ( runAll || cfg.specs.indexOf(name) != -1 )
      describe.call(cfg.specCtx, '', function() {
        after(function() { console.log('TOTAL(ms): '.spec+name.toUpperCase()) })
        describe(name.toUpperCase().spec, require(Path.join(cfg.paths.specs,name)))
      })
  }

  global.IT = function(title, fn) {
    it.call(this, title, function(dn) {
      this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
      global.DONE = dn
      fn.call(this, dn)
    })
  }

  global.DESCRIBE = function(title, fn) {
    describe.call(this, title.spec, fn)
  }

  return {

    run(screamInit, screamIt) {

      describe('SCREAM'.spec, function() {

        before(screamInit)

        beforeEach(screamIt)

        for (var spec of specs)
          SPEC(spec)

      })

    }

  }

}


module.exports = Runner
