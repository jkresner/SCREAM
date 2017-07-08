

anon = ->


  IT '/about => OK', ->
    PAGE '/about', { authenticated: false }, (html) ->
      expect(html).inc '<h1>About</h1>'
      DONE()


  IT '/contact => NotFound', ->
    PAGE '/contact', { status: 404, authenticated: false }, (text) ->
      expect(text).inc 'Cannot GET'
      DONE()


module.exports = ->

  DESCRIBE("ANONYMOUS", anon)
