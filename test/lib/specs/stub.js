var called = 0
var custom = {
  fullname(first, last) {
    called = called+1
    return `${first} ${last}`
  },
  hello(name, done) {
    called = called+1
    done(null, `hello ${name}`)
  },

  api: {
    users: {
      get(url, opts, done) {},
      // get(url, opts, error, success) {},
      // del(url, opts, done) {},
    }
  },
  searchUsers(searchToken, done) {
    var opts = { fields: 'name first' }
    called = called + 1
    this.api.users.get(`/users?s=${searchToken}`, opts, done)
  }
  // searchUsers(searchToken, done) {
  //   var opts = { fields: 'name first' }
  //   var onError = (e) => done(e)
  //   var onSuccess = (r) => done(null, r)
  //   called = called + 1
  //   this.api.users.get(`/users?s=${searchToken}`, opts, onError, onSuccess)
  // }
}


module.exports = () => {

  beforeEach(function() {
    called = 0
  })

  after(function() {
    delete global.STUB
  })

  describe("config.stubs on", function() {

    before(function() {
      OPTS.config.stubs = { on: true, timeout: 3000 }
      global.STUB = require('../../../lib/scream.stub')()
    })

    it(`STUB.spy(obj, fn)`, function(done) {
      var spy = STUB.spy(custom, 'fullname')
      expect(spy).to.exist
      expect(called).to.equal(0)
      expect(spy.called).to.be.false
      var full = custom.fullname('jay', 'kay')
      expect(full).to.equal('jay kay')
      expect(called).to.equal(1)
      expect(spy.called).to.be.true
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0]).to.equal('jay')
      expect(spy.args[0][1]).to.equal('kay')
      spy.restore()
      done()
    })

    it("STUB.sync(obj, fn, return)", function(done) {
      var stub = STUB.sync(custom, 'fullname', 'stub name')
      expect(stub).to.exist
      expect(called).to.equal(0)
      expect(stub.called).to.be.false
      var full = custom.fullname('jay', 'kay')
      expect(full).to.equal('stub name')
      expect(called).to.equal(0)
      expect(stub.called).to.be.true
      expect(stub.calledOnce).to.be.true
      expect(stub.args[0][0]).to.equal('jay')
      expect(stub.args[0][1]).to.equal('kay')
      stub.restore()
      done()
    })

    describe("callbacks", function() {

      before(function(done) {
        custom.hello('jay', (e1, r1) => {
          expect(e1).to.be.null
          expect(r1).to.equal('hello jay')
          done()
        })
      })

      it("STUB.callback(obj, fn, [args])", function(done) {
        var cbArgs = [null, 'hello jonny']
        var stub = STUB.callback(custom, 'hello', cbArgs)
        expect(stub).to.exist
        expect(called).to.equal(0)
        expect(stub.called).to.be.false
        custom.hello('jay', (e, r) => {
          expect(e).to.be.null
          expect(r).to.equal('hello jonny')
          expect(called).to.equal(0)
          expect(stub.called).to.be.true
          expect(stub.calledOnce).to.be.true
          expect(stub.args[0][0]).to.equal('jay')
          stub.restore()
          done()
        })
      })

      it("STUB.error(obj, fn, e)", function(done) {
        var err = Error('testerr')
        var stub = STUB.error(custom, 'hello', err)
        expect(stub).to.exist
        expect(called).to.equal(0)
        expect(stub.called).to.be.false
        custom.hello('kay', (e, r) => {
          expect(e.message).to.equal('testerr')
          expect(r).to.be.undefined
          expect(called).to.equal(0)
          expect(stub.calledOnce).to.be.true
          expect(stub.args[0][0]).to.equal('kay')
          stub.restore()
          done()
        })
      })

      it("STUB.success(obj, fn, r)", function(done) {
        var R = 'hallo jono'
        var stub = STUB.success(custom, 'hello', R)
        custom.hello('gay', (e, r) => {
          expect(e).to.be.null
          expect(r).to.equal('hallo jono')
          expect(called).to.equal(0)
          expect(stub.calledOnce).to.be.true
          expect(stub.args[0][0]).to.equal('gay')
          stub.restore()
          done()
        })
      })
    })


    describe("STUB.wrapper", function() {

      before(function() {
        global.Wrappers = { custom }
        global.FIXTURE = { wrappers: require('../fixtures/wrappers') }
        var {searchUsers1} = FIXTURE.wrappers
        expect(searchUsers1.length).to.equal(3)
        expect(searchUsers1[0].name).to.equal('Jonny Five')
      })

      after(function() {
        delete global.Wrappers
        delete global.FIXTURE
      })

      // it(`STUB.wrapper(<name>).cb(<fnName>, FIXURE.wrapper[<key>])`)
      // it(`STUB.wrapper(<name>).api(<fnPath>).params(args:[])`)

      it(`STUB.wrapper(<name>).api(<fnPath>).err(<FIXTURE.key:string>)`, function(done) {
        var stub = STUB.wrapper('custom').api('users.get').err('err1')
        expect(called).to.equal(0)
        Wrappers.custom.searchUsers('blah', (e,r) => {
          expect(called).to.equal(1)
          expect(stub.called).to.be.true
          expect(stub.args[0][0]).to.equal('/users?s=blah')
          expect(r).to.be.undefined
          expect(e.message).to.equal(FIXTURE.wrappers.err1.message)
          stub.restore()
          done()
        })
      })

      it(`STUB.wrapper(<name>).api(<fnPath>).err(<e:Error>)`)

      it(`STUB.wrapper(<name>).api(<fnPath>).success(<FIXTURE.key:string>)`, function(done) {
        var stub = STUB.wrapper('custom').api('users.get').success('searchUsers1')
        expect(called).to.equal(0)
        Wrappers.custom.searchUsers('bleh', function(e, r) {
          expect(called).to.equal(1)
          expect(stub.called).to.be.true
          expect(stub.args[0][0]).to.equal('/users?s=bleh')
          expect(e).to.be.null
          expect(r).to.exist
          var {searchUsers1} = FIXTURE.wrappers
          expect(r.length).to.equal(searchUsers1.length)
          expect(r[0].name).to.equal('Jonny Five')
          expect(r[1].name).to.equal(searchUsers1[1].name)
          stub.restore()
          done()
        })
      })

      it(`STUB.wrapper(<name>).api(<fnPath>).success(r:{})`)

    })

    it(`Configure timeout to 100ms`)
  })

  describe("config.stubs off", function() {

    before(function() {
      OPTS.config.stubs = { on: false }
      global.STUB = require('../../../lib/scream.stub')()
    })

    it(`STUB.spy(obj, fn)`, function(done) {
      var spy = STUB.spy(custom, 'fullname')
      expect(spy).to.exist
      expect(called).to.equal(0)
      expect(spy.called).to.be.false
      var full = custom.fullname('jay', 'kay')
      expect(full).to.equal('jay kay')
      expect(called).to.equal(1)
      expect(spy.calledOnce).to.be.true
      spy.restore()
      done()
    })

    it("STUB.sync(obj, fn, return)", function(done) {
      var stub = STUB.sync(custom, 'fullname', 'stub name')
      expect(stub).to.exist
      expect(called).to.equal(0)
      expect(stub.called).to.be.false
      var full = custom.fullname('jay', 'kay')
      expect(full).to.equal('jay kay')
      expect(called).to.equal(1)
      expect(stub.called).to.be.true
      stub.restore()
      done()
    })


  })

}
