var {paths,http,setup,stubs,specs}   = OPTS.config
global.SPEC         = require('./scream.spec')
global.DESCRIBE     = require('./scream.describe')
global.IT           = require('./scream.it')
global.ONLY         = IT.only
global.SKIP         = IT.skip

if (paths.slang)
  global.EXPECT     = require(paths.slang)
if (stubs.on)
  global.STUB       = require('./scream.stub')()
if (paths.stories)
  global.STORY      = require('./scream.story')(deps, OPTS)
if (http)
  require('./http')()

var all = specs == 'all'
var names = deps.Fs
  .readdirSync(paths.specs)
  .filter( file => file.match(paths.codeExt))
  .map( file => file.replace(paths.codeExt,'') )
  .filter( name => all || specs.match(name) )

for (var name of names) SPEC(name)
OPTS.log.setup(`SPECS${all?'':'.only'}`, names.length)

OPTS.log.setup('APP', 'loading')
before(function(done) {
  deps.Setup.app(function(e, app) {
    var base = OPTS.log.runner.screamed(deps.Path.basename(paths.specs))
    if (setup.done) setup.done()

    console.log(`${base}${all?'':' (only)'} ${names.join('|')}\n`.spec)
    done()
  })
})

afterEach(function(){
   global.DONE = null
   if (global.LOGOUT) LOGOUT()
   if (global.STUB) STUB.restoreAll()
})
