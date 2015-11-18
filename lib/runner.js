var Path     = require('path')
var {cfg,init,specs} = _RUNNER


global.SPEC = function(name) {
  describe.call(cfg.specCtx, '', function() {
    before(function() { cfg.specCtx.start = new Date })
    after(function() { console.log(`    TIME(ms): ${new Date()-cfg.specCtx.start}`.spec) })
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
IT.only = function(title, fn) {
  it.only.call(this, title, function(dn) {
    this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
    global.DONE = dn
    fn.call(this, dn)
  })
}
global.ONLY = IT.only

global.SKIP = it.skip

global.DESCRIBE = function(title, fn) {
  describe.call(this, title.spec, fn)
}


describe('SCREAM'.spec, function() {

  before(init)

  beforeEach(function(done){
    LOGOUT()
    done()
  })

  afterEach(function(){
    global.DONE = null
    if (STUB && STUB.stubs) {
      for (var stub of STUB.stubs)
        stub.restore()
      STUB.stubs = []
    }
  })

  for (var spec of specs)
    SPEC(spec)

})
