module.exports = ({Scream,Path}) => () =>

describe("Validation", function() {


  it('Requires a config file', function(done) {
    expect(()=>Scream()).to.throw(Error, 'config.json')
    done()
  })


  // it('Requires a root path', function(done) {
  //   var cfg = { mongoUrl: 'blah' }
  //   expect(()=>Scream(cfg)).to.throw(Error, 'config.scream.path.root required')
  //   cfg.scream = { path: {} }
  //   expect(()=>Scream(cfg)).to.throw(Error, 'config.scream.path.root required')
  //   done()
  // })


  // it('Assigns a default app path', function(done) {
  //   var cfg = { mongoUrl: 'blah', scream: { path: { root: '/root' } } }
  //   var SCREAM = Scream(cfg)
  //   console.log('SCREAM', SCREAM)
  //   expect(SCREAM.cfg.scream.path.app).to.equal('/root/../server/app')
  //   done()
  // })


})


