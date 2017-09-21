var {paths,http,stubs,specs,setup} = OPTS.config

global.SPEC         = require('./scream.spec')
global.DESCRIBE     = require('./scream.describe')
global.IT           = require('./scream.it')
global.ONLY         = IT.only
global.SKIP         = IT.skip
global.STUB         = require('./scream.stub')()


global.IN   = (ms, fn) => setTimeout(fn, ms) // V. helpful .coffee syntax sugar
global.WHEN = (asyncs, success) => Promise.all(
  asyncs.map(f => new Promise((res, rej) => f((e,r)=>e?rej(e):res(r)))))
    .then(r => success(r), e => global.DONE ? DONE(e) : console.log(e))

// if (paths.slang)
  require('./scream.slang')
if (http)
  require('./scream.http')()
if (paths.stories)
  global.STORY      = require('./scream.story')(deps, OPTS)


var all = specs == 'all'
var names = deps.Fs
  .readdirSync(paths.specs)
  .filter( file => file.match(setup.ext))
  .map( file => file.replace(setup.ext,'') )
  .filter( name => all || specs.match(name) )

OPTS.log.info(`SPECS${all?'':'.only'}`, `${specs} => ${names.length} required`)

if (names.length == 0) {
  OPTS.log.info("FAIL", `No specs matching "${specs}"`.red)
  process.exit(1)
}

for (var name of names) {
  try {
    SPEC(name)
  } catch (e) {
    console.log(`\n  SCREAM.SPEC(${name}) failed to instantiate`)
    OPTS.setup.fail(e)
  }
}


before(function(done) {
  OPTS.log.info('APP', 'loading').flush()
  OPTS.setup.app(function(e) {
    console.log(`\n SPECS ${all?'':' (only)'} ${names.join('|')}\n`.spec)
    if ((OPTS.setup||{}).done)
      OPTS.setup.done(done)
    else
      done()
  })
})

afterEach(function() {
  global.DONE = null
  if (global.LOGOUT) LOGOUT()
  if (global.STUB) STUB.restoreAll()
})
