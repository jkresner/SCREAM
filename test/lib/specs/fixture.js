module.exports = () => {


  before(function() {
    global.deps = { Util: require('../../../lib/_util') }
    global.FIXTURE = require('../../../lib/data.fixture')
  })

  after(function() {
    delete global.FIXTURE
    delete global.deps
  })


  describe("Clone", function() {
    it('Fixture data cannot be changed')
    it('Change cloned fixture data')
  })


  describe("Uniquify", function() {

    it(`Fail Fixture['test'] undefined`, function() {
      expect(()=>FIXTURE.uniquify('test', 'blah', 'name'))
                        .to.throw(Error, 'FIXTURE.test undefined')
    })

    it(`Fail Fixture.user['test'] is null`, function() {
      expect(()=>FIXTURE.uniquify('user', 'test', 'name'))
                        .to.throw(Error, 'FIXTURE.user.test undefined')
    })

    it(`Fail Uniquify without attrs`, function() {
      expect(()=>FIXTURE.uniquify('user', 'jk'))
                        .to.throw(Error, '<attrs> required')
    })

    it(`Uniquify Fixture.user.jk['name']`, function(done) {
      var {jk} = FIXTURE.user
      var key = FIXTURE.uniquify('user', 'jk', 'name')
      expect(key).to.exist
      var jkU = FIXTURE.user[key]
      expect(jkU).to.exist
      expect(jkU._id.toString()).not.equal(jk._id)
      expect(jkU.name).not.equal(jk.name)
      expect(jkU.company).to.equal(jk.company)
      expect(jkU.age).to.equal(jk.age)
      done()
    })

    it(`Uniquify Fixture.user.jk['name company age']`, function(done) {
      var {jk} = FIXTURE.user
      var key = FIXTURE.uniquify('user', 'jk', 'name company age')
      var jkU = FIXTURE.user[key]
      expect(jkU).to.exist
      expect(jkU._id.toString()).not.equal(jk._id)
      expect(jkU.name).not.equal(jk.name)
      expect(jkU.name.indexOf(jk.name)).not.equal(-1)
      expect(jkU.company).not.equal(jk.company)
      expect(jkU.company.indexOf(jk.company)).not.equal(-1)
      expect(jkU.age).not.equal(jk.age)
      done()
    })

  })

}
