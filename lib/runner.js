var {paths,http,stubs,specs}   = OPTS.config

global.SPEC         = require('./scream.spec')
global.DESCRIBE     = require('./scream.describe')
global.IT           = require('./scream.it')
global.ONLY         = IT.only
global.SKIP         = IT.skip
global.STUB         = require('./scream.stub')()

global.IN           = (ms, fn) => setTimeout(fn, ms) // Very helpful .coffee Syntax sugar
global.AFTER = (asyncs, success) => {
  let proms = asyncs.map(f => new Promise((res, rej) => f((e,r)=>e?rej(e):res(r))))
  Promise.all(proms).then(r => success(r), e => DONE(e))
}

if (paths.slang)
  require(paths.slang)
if (http)
  require('./scream.http')()
if (paths.stories)
  global.STORY      = require('./scream.story')(deps, OPTS)


var all = specs == 'all'
var names = deps.Fs
  .readdirSync(paths.specs)
  .filter( file => file.match(paths.codeExt))
  .map( file => file.replace(paths.codeExt,'') )
  .filter( name => all || specs.match(name) )


for (var name of names) {
  try {
    SPEC(name)
  } catch (e) {
    console.log(`\n  SCREAM.SPEC(${name}) failed to instantiate`)
    console.log('\n  '+OPTS.log.error(e)+'\n')
    process.exit(1)
  }
}

OPTS.log.setup(`SPECS${all?'':'.only'}`, names.length)
OPTS.log.setup('APP', 'loading')

before(function(done) {
  OPTS.appInit = true
  deps.Setup.app(function(e, app) {
    var base = OPTS.log.runner.screamed(deps.Path.basename(paths.specs))
    if ((OPTS.setup||{}).done) OPTS.setup.done()
    console.log(`${base}${all?'':' (only)'} ${names.join('|')}\n`.spec)
    OPTS.appInit = false
    done()
  })
})

afterEach(function(){
   global.DONE = null
   if (global.LOGOUT) LOGOUT()
   if (global.STUB) STUB.restoreAll()
})
