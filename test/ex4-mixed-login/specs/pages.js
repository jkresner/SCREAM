var anon = function() {

  IT('[200] /', () =>
    PAGE('/', { session: null }, html => {
      expect(html).inc(['Index HBS','Login please'])
      expect(html.indexOf('Welcome') == -1).to.be.true
      DONE()
    }))


  IT('[302] /dashboard => /login', () =>
    PAGE('/dashboard', { session: null, status: 302 }, text => {
      expect(text).inc('Redirecting to /login')
      DONE()
    }))

}

var authd = function() {

  IT('[302] / => /dashboard', () =>
    LOGIN('tst1', { status: 302 }, text => {
      expect(text).inc('Redirecting to /dashboard')
      PAGE('/dashboard', { status: 200 }, html => {
        expect(html).inc(['Index HBS',`Welcome ${FIXTURE.users.tst1.name}!`])
        expect(html.indexOf('Please login') == -1).to.be.true
        DONE()
      })
    }))


  IT('[200] /', () =>
    LOGIN('tst5', {}, text => {
      PAGE('/', { status: 200 }, html => {
        expect(html).inc(['Index HBS',`Welcome ${FIXTURE.users.tst5.name}!`])
        expect(html.indexOf('Please login') == -1).to.be.true
        DONE()
      })
    }))

}



module.exports = function() {

  DESCRIBE("ANONYMOUS", anon)
  DESCRIBE("AUTHENTICATED", authd)

}
