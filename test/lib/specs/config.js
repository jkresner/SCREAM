var Config                  = require('../../../lib/config')
var Path                    = require('path')


module.exports = () => {


describe("Validation", function() {


  it('Requires a root dir', function(done) {
    expect(()=>Config({Path},null,{})).to.throw(Error, 'config.json')
    done()
  })


  it('Requires a config file', function(done) {
    expect(()=>Config({Path},__dirname,{})).to.throw(Error, 'config.json')
    done()
  })


})


describe("Defaults", function() {

  it('Assigns default app path')

})


describe("Command line flags", function() {

  it('Runs select specs using --spec (-s) flag')

})




}
