//-- Integration style tests for initializing a SCREAM instance

var Scream                   = require('../../../lib/index.js')
var Path                     = require('path')

module.exports = () =>


describe("Example projects", function() {


  this.timeout(500000)


  it('Requires a config file', function(done) {
    expect(()=>Scream(__dirname,{})).to.throw(Error, 'scream.json')
    done()
  })


  // it('Example 1 runs with empty app config', function(done) {
  //   var _dir = Path.normalize(__dirname+'/../../ex1-js')
  //   var ex1 = Scream(_dir,{})
  //   expect(ex1.config).to.exist
  //   expect(ex1.config.stubs.on).to.be.true
  //   ex1.run(()=>{
  //     done()
  //   })
  // })


  // it('Example 2 runs with app config', function(done) {
  //   var _dir = Path.normalize(__dirname+'/../../ex2-coffee')
  //   var appConfig = require(Path.normalize(_dir+'/app/setup'))('test').config
  //   var ex2 = Scream(_dir,appConfig)
  //   expect(ex2.config).to.exist
  //   ex2.run(()=>{
  //     done()
  //   })
  // })


  // it('Example 3 runs', function(done) {
  //   var _dir = Path.normalize(__dirname+'/../../ex3-bson-restore')
  //   var appConfig = require(Path.normalize(_dir+'/server/config'))('test')
  //   var ex3 = Scream(_dir,appConfig)
  //   expect(ex3.config).to.exist
  //   ex3.run(()=>{
  //     done()
  //   })
  // })


  //-- TODO: figure out how to run the integration tests in sequence


  it('Example 4 runs', function(done) {
    var _dir = Path.normalize(__dirname+'/../../ex4-mixed-login')
    var appConfig = {
      appViewDir:               Path.join(_dir,'/server/views'),
      auth:                     { loginUrl: '/', loggedinUrl: '/' },
      http: {
        port:                   3104,
        session: {
          saveUninitialized:    true,
          resave:               false,
          name:                 'mirco-consult',
          secret:               'mirco-consulting',
          cookie:               { httpOnly: true, maxAge: 9000000 }
        }
      }
    }
    var login = require(Path.normalize(_dir+'/login'))
    var ex4 = Scream(_dir,appConfig,{login})
    expect(ex4.config).to.exist
    ex4.run(()=>{
      done()
    })
  })


})


