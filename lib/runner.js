var pad                        = '  '
var {Colors,Path,Fs}           = deps
var {verbose,paths,specs,init} = OPTS.config


var runAll = !specs || specs == 'all'
var specs = Fs.readdirSync(paths.specs)
              .filter(f => ['.js','.coffee'].indexOf(Path.extname(f))!=-1)
              .map(file => file.replace(Path.extname(file),'').trim())
              .filter(name => runAll || specs.indexOf(name) != -1)


global.SPEC = function(name) {
  describe.call(global.CTX, name.toUpperCase().spec, function() {
    before(function() { pad += '  '; global.CTX.start = new Date; })
    after(function() { pad = pad.replace('  ',''); console.log(`${pad}TIME (${new Date()-global.CTX.start}ms)`.speed); })
    require(Path.join(paths.specs,name))()
  })
}


var itWrap = (fn) => function(done) {
  if (verbose) console.log(pad+`✓ ${this.test.title}`.white.dim)
  this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
  this.timeSeed = moment().format('X')
  global.THIS = this
  global.DONE = done
  EXPECT.todo = code => console.log(pad+`✓ `.todo+"expect${code} ".spec.dim+"(todo)".todo)
  runState = "Spec.it"
  fn.call(this, done)
}


global.IT = function(title, fn) { it(title, itWrap(fn)) }
global.ONLY = IT.only = function(title, fn) { it.only(title, itWrap(fn)) }
global.SKIP = IT.skip = function(title, fn) { it.skip(title) }
// global.ONLY = IT.only
// global.SKIP = it.skip


global.DESCRIBE = function(title, fn) {
  describe.call(this, title.toUpperCase().subspec, function() {
    before(() => pad += '  ')
    after(() => pad = pad.replace('  ',''))
    fn()
  })
}
DESCRIBE.skip = function(title, fn) { describe.skip.call(this, title.spec, fn) }



before(function(done) {
  var initStart = new Date()
  require('./app.init').call(this, function(e) {
    if (e) return done(e)
    global.APP = OPTS.App(function(ee) {
      if (ee) return done(ee)
      if (OPTS.onReady) OPTS.onReady()
      if (verbose) console.log(`                   (${new Date()-initStart}ms)\n`.speed)
      done()
    })

  })
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


for (var spec of specs) SPEC(spec)
