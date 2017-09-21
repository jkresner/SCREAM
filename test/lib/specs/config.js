let Config                  = require('../../../lib/config')
let Path                    = { dirname: () => join(__dirname,'../fixtures/config1') }
let av                      = process.argv
let about                   = { version: "1.1.1" }

module.exports = () => {

  beforeEach(function() {
    for (var prop in process.env) delete process.env[prop]
  })

  after(function() { process.argv = av })


  describe("Basic", function() {

    it('Default w no flags, opts, or .json values', function() {
      process.argv = [av[0],av[1]]
      let cfg = Config({Path},{about})
      expect(cfg.colors.seed).to.equal("white")
      expect(cfg.colors.spec).to.equal("white")
      expect(cfg.colors.speed).to.equal("green")
      expect(cfg.colors.subspec).to.equal("white")
      expect(cfg.colors.init).to.equal("gray")
      expect(cfg.colors.todo).to.equal("yellow")
      expect(cfg.colors.error).to.equal("red")
      expect(cfg.http.api.baseUrl).to.equal("/api")
      expect(cfg.mocha.bail).to.equal(true)
      expect(cfg.mocha.fullStackTrace).to.equal(false)
      expect(cfg.mocha.reporter).to.equal("spec")
      expect(cfg.db).to.be.undefined
      expect(cfg.log.filter_fail.test("emitCloseNT|next_tick")).to.be.true
      expect(cfg.log.verbose).to.be.undefined
      expect(cfg.log.quiet).to.be.undefined
      expect(Object.keys(cfg.paths).length).to.equal(2)
      expect(cfg.paths.app).to.equal(Path.dirname())
      expect(cfg.paths.specs).to.equal(join(Path.dirname(),'specs'))
      expect(cfg.setup.done).to.be.undefined
      expect(cfg.setup.ext.test(".js")).to.be.true
      expect(cfg.setup.ext.test(".coffee")).to.be.true
      expect(cfg.setup.timeout).to.equal(2000)
      expect(cfg.specs).to.equal('all')
      expect(cfg.stubs.on).to.be.true
    })

    it('Sets full dir paths', function() {
      process.argv = [av[0],av[1],'-c','flag']
      let cfg = Config({Path},{about})
      expect(Object.keys(cfg.paths).length).to.equal(4)
      expect(cfg.colors.spec).to.equal("yellow")
      expect(cfg.paths.app).to.equal(Path.dirname())
      expect(cfg.paths.specs).to.equal(join(Path.dirname(),'specs'))
      expect(cfg.paths.fixtures).to.equal(join(Path.dirname(),'..'))
      expect(cfg.paths.bson).to.equal(join(Path.dirname(),'..','..','bson'))
    })

  })


  describe("Flags", function() {

    it("none", function() {
      process.argv = [av[0],av[1]]
      let cfg = Config({Path},{about})
      expect(cfg.colors.spec).to.equal("white")
      expect(cfg.mocha.grep).to.be.undefined
      expect(cfg.db).to.be.undefined
      expect(cfg.specs).to.equal('all')
      expect(cfg.stubs.on).to.be.true
    })

    it("argv only", function() {
      process.argv = [av[0],av[1],'-c','flag','-o','authv',
                      '-g','flags_only',
                      '-s','-l','APP_INIT','-v','-q','-u']
      let cfg = Config({Path},{about})
      expect(cfg.colors.spec).to.equal("yellow")
      expect(cfg.mocha.grep).to.equal("flags_only")
      expect(cfg.db.mongo.url).to.exist
      expect(cfg.db.mongo.collections.length).to.equal(1)
      expect(cfg.db.mongo.collections[0]).to.equal('users')
      expect(cfg.db.seed.force).to.be.true
      expect(cfg.db.seed.dirty).to.be.false
      expect(cfg.log.flag).to.equal("APP_INIT")
      expect(cfg.log.verbose).to.be.true
      expect(cfg.log.quiet).to.be.undefined
      expect(cfg.specs).to.equal('authv')
      expect(cfg.stubs.on).to.be.false
    })

    it("opts only", function() {
      process.argv = [av[0],av[1]]
      let opts = {about,flags:{logFlag:'CFG_INIT',unstub:true},setup:{timeout:5000}}
      let cfg = Config({Path}, opts)
      expect(cfg.colors.spec).to.equal("white")
      expect(cfg.mocha.grep).to.be.undefined
      expect(cfg.db).to.be.undefined
      expect(cfg.log.flag).to.equal("CFG_INIT")
      expect(cfg.log.verbose).to.be.undefined
      expect(cfg.log.quiet).to.be.undefined
      expect(cfg.setup.timeout).to.equal(5000)
      expect(cfg.specs).to.equal('all')
      expect(cfg.stubs.on).to.be.false
    })

    it("argv + opts flags", function() {
      process.argv = [av[0],av[1],'-c','flag','-e','STAGING',
                      '-o','authv|autho',
                      '-g','flags_n_args',
                      '-S','-l','APP_START','-u']
      let opts = {about,flags:{config:'local',logFlag:'CFG_ROUTE',
                         unstub:true,quiet:true}}
      let cfg = Config({Path}, opts)
      expect(cfg.colors.spec).to.equal("yellow")
      expect(cfg.mocha.grep).to.equal("flags_n_args")
      expect(cfg.db.seed.force).to.be.true
      expect(cfg.db.seed.dirty).to.be.true
      expect(cfg.log.flag).to.equal("APP_START")
      expect(cfg.log.verbose).to.be.undefined
      expect(cfg.log.quiet).to.be.true
      expect(cfg.specs).to.equal('authv|autho')
      expect(cfg.stubs.on).to.be.false
      expect(process.env[`ENV`]).to.equal('STAGING')
    })

  })


}
