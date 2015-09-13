

anon = ->


  IT '/about => OK', ->
    PAGE '/about', { authenticated: false }, (html) ->
      expectContains(html,'<h1>About</h1>')
      DONE()


  IT '/contact => NotFound', ->
    PAGE '/contact', { status: 404, authenticated: false }, (text) ->
      expectContains(text,'Cannot GET')
      DONE()


module.exports = ->

  DESCRIBE("ANONYMOUS", anon)
