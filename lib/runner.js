var Version  = require('../package.json').version
var Path     = require('path')
var {cfg,init,specs} = _RUNNER


global.SPEC = function(name) {
  describe.call(cfg.specCtx, '', function() {
    before(function() { cfg.specCtx.start = new Date })
    after(function() { console.log(`    TIME(ms): ${new Date()-cfg.specCtx.start}`.spec) })
    describe(name.toUpperCase().spec, require(Path.join(cfg.paths.specs,name)))
  })
}


var itWrap = (fn) => function(done) {
  this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
  this.timeSeed = moment().format('X')
  global.THIS = this
  global.DONE = done
  fn.call(this, done)
}



global.IT = function(title, fn) {
  it(title, itWrap(fn))
}
IT.only = function(title, fn) {
  it.only(title, itWrap(fn))
}
IT.skip = function(title, fn) {
  it.skip(title)
}
global.ONLY = IT.only
global.SKIP = it.skip

global.DESCRIBE = function(title, fn) {
  describe.call(this, title.spec, fn)
}
DESCRIBE.skip = function(title, fn) {
  describe.skip.call(this, title.spec, fn)
}




describe(`SCREAM v${Version}`.spec, function() {

  before(function(done) {
    var Domain = require('domain')
    var domain = Domain.create()
    Domain.active = domain
    domain.add(init)
    domain.on('error', e => done(Error('SCREAM App Init fail => '+
      _.take(e.stack.split('\n')
              .filter(ln => !ln.match(/(node_modules|runInThisContext|NativeConnection|module\.)/i))
            , 15).join('\n')))
    )
    domain.run(() => init.call(this, done))
  })

  beforeEach(function(done) {
    global.THIS = this
    global.TIMEOUT = ms => global.THIS.timeout(ms)
    LOGOUT()
    done()
  })

  afterEach(function(){
    global.DONE = null
    if (STUB) STUB.restoreAll()
  })

  for (var spec of specs)
    SPEC(spec)

})
