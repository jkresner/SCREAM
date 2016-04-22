var Domain                   = require('domain')
var Version                  = require('../package.json').version
var {Path,Fs}                = _RUNNER.deps
var {paths,specs,init}       = _RUNNER.opts.config


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
  runState = "Spec.it"
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
    _RUNNER.onInit.call(this, done)
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
