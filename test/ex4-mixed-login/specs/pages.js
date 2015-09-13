var anon = function() {

  IT('/ OK', () =>
    PAGE('/', { authenticated: false }, (html) => {
      expectContains(html,'Index HBS')
      DONE()
    }))


  IT('/dashboard 302 to /?returnTo=/dashboard', () =>
    PAGE('/dashboard', { authenticated: false, status: 302 }, (text) => {
      expectContains(text,'Redirecting to /?returnTo=/dashboard')
      DONE()
    }))

}

var authd = function() {

  IT('/ 302 to /dashboard', () =>
    LOGIN({key:'tst1'}, (session) => {
      expectIdsEqual(session._id, FIXTURE.users.tst1._id)
      expect(session.name).to.equal('Expert One')
      PAGE('/', { status: 302 }, (text) => {
        expectContains(text,'Redirecting to /dashboard')
        DONE()
      })
    }))


  IT('/dashboard OK', () =>
    LOGIN({key:'tst5'}, (session) => {
      expectIdsEqual(session._id, FIXTURE.users.tst5._id)
      PAGE('/dashboard', { status: 200 }, (text) => {
        expectContains(text,'Index HBS')
        DONE()
      })
    }))

}



module.exports = function() {

  DESCRIBE("ANONYMOUS", anon)
  DESCRIBE("AUTHENTICATED", authd)

}
