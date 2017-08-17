var SID = html => html.match(/session:.* /)[0].split(':')[1]


var anon = function() {

  IT('Persists over multiple requests', () =>
    PAGE('/', { session: null }, html => {
      expect(html).inc(/session:.* /)
      PAGE('/', {}, html2 => {
        expect(SID(html)).to.equal(SID(html2))
        PAGE('/', { session: null }, html3 => {
          expect(SID(html) == SID(html3)).to.be.false
          DONE()
        })
      })
    }))

}

var authd = function() {

  IT('Persists over login', () =>
    PAGE('/', { session: null }, html => {
      expect(html).inc(/session:.* /)
      LOGIN('tst1', { status: 302 }, text => {
        PAGE('/dashboard', { status: 200 }, html2 => {
          expect(SID(html)).to.equal(SID(html2))
          DONE()
        })
      })
    }))


  IT('New sessionID when opts.session == null', () =>
    PAGE('/', { session: null }, html => {
      expect(html).inc(/session:.* /)
      LOGIN('tst1', { status: 302, session: null }, text => {
        PAGE('/dashboard', { status: 200 }, html2 => {
          expect(SID(html) === SID(html2)).to.be.false
          DONE()
        })
      })
    }))
}



module.exports = function() {

  DESCRIBE("ANONYMOUS", anon)
  DESCRIBE("AUTHENTICATED", authd)

}
