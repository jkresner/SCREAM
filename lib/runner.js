var {paths,setup,specs}   = OPTS.config
global.moment       = global.moment || require("moment")

global.SPEC         = require('./scream.spec')
global.DESCRIBE     = require('./scream.describe')
global.IT           = require('./scream.it')
global.ONLY         = IT.only
global.SKIP         = IT.skip
global.STUB         = require('./scream.stub')
global.STORY        = require('./scream.story')(deps, OPTS)

require(paths.slang)


before(function(done) {
  deps.Setup.app(function(e, app) {
    require('./http')(app)
    console.log(OPTS.log.runner.screamed(deps.Path.basename(paths.specs))+'\n')
    done()
    if (setup.done) setup.done()
  })
})


beforeEach(function() {
  // global.TIMEOUT = ms => this.timeout(ms)
  if (LOGOUT) LOGOUT()
})


afterEach(function(){
   global.DONE = null
   if (STUB) STUB.restoreAll()
})


deps.Fs.readdirSync(paths.specs)
    .filter( file => file.match(paths.codeExt) )
    .map( file => file.replace(paths.codeExt,'') )
    .forEach( name => specs=='all' || specs.match(name) ? SPEC(name) : 0 )
