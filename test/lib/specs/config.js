var Config                  = require('../../../lib/config')
var Path                    = require('path')


var Deps = {Path}


module.exports = () => {


describe("Validation", function() {


  it('Requires a root dir', function(done) {
    expect(()=>Config(Deps,{root:__dirname})).to.throw(Error, 'scream.json')
    done()
  })


  it('Requires a config file', function(done) {
    expect(()=>Config(Deps,{root:__dirname})).to.throw(Error, 'scream.json')
    done()
  })


})


describe("Defaults", function() {

  it('Assigns default paths', function(done) {
    var Opts = { root: Path.join(__dirname,'../fixtures/config1') }
    var cfg = Config(Deps,Opts)
    expect(cfg.paths.root).to.equal(Opts.root)
    expect(cfg.paths.app).to.equal(Path.join(Opts.root,'../../server/app.js'))
    expect(cfg.paths.specs).to.equal(Path.join(Opts.root,'specs'))
    // expect(cfg.paths.flavors).to.equal(Path.join(Opts.root,'flavors'))
    done()
  })

})


describe("Command line flags", function() {

  it('Runs select specs using --spec (-s) flag')

})




}
