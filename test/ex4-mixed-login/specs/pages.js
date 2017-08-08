var anon = function() {

  IT('/ OK', () =>
    PAGE('/', { authenticated: false }, (html) => {
      expect(html).inc('Index HBS')
      DONE()
    }))


  IT('/dashboard 302 to /?returnTo=/dashboard', () =>
    PAGE('/dashboard', { authenticated: false, status: 302 }, (text) => {
      expect(text).inc('Redirecting to /?returnTo=/dashboard')
      DONE()
    }))

}

var authd = function() {

  IT.only('/ 302 to /dashboard', () =>
    LOGIN({key:'tst1'}, (session) => {
      expect(session._id.toString()).to.equal(FIXTURE.users.tst1._id.toString())
      expect(session.name).to.equal('Expert One')
      PAGE('/', { status: 302 }, (text) => {
        expect(text).to.inc('Redirecting to /dashboard')
        DONE()
      })
    }))


  IT('/dashboard OK', () =>
    LOGIN({key:'tst5'}, (session) => {
      expect(session._id.toString()).to.equal(FIXTURE.users.tst5._id.toString())
      PAGE('/dashboard', { status: 200 }, (text) => {
      expect(text).inc('Index HBS')
        DONE()
      })
    }))

}



module.exports = function() {

  DESCRIBE("ANONYMOUS", anon)
  DESCRIBE("AUTHENTICATED", authd)

}
