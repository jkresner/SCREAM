var Version                  = require('../package.json').version
var {Path,Fs}                = _RUNNER.deps
var {paths,specs}            = _RUNNER.opts.config


var runAll = !specs || specs == 'all'
var specs = Fs.readdirSync(paths.specs)
              .filter(f => ['.js','.coffee'].indexOf(Path.extname(f))!=-1)
              .map(file => file.replace(Path.extname(file),''))
              .filter(name => runAll || specs.indexOf(name) != -1)


global.SPEC = function(name) {
  describe.call(global.CTX, '', function() {
    before(function() { global.CTX.start = new Date })
    after(function() { console.log(`    TIME(ms): ${new Date()-global.CTX.start}`.spec) })
    describe(name.toUpperCase().spec, require(Path.join(paths.specs,name)))
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
    domain.add(_RUNNER.onInit)
    domain.on('error', e => done(Error('SCREAM App Init fail => '+
      _.take(e.stack.split('\n')
              .filter(ln => !ln.match(/(node_modules|runInThisContext|NativeConnection|module\.)/i))
            , 15).join('\n')))
    )
    domain.run(x => _RUNNER.onInit.call(this, done))
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
