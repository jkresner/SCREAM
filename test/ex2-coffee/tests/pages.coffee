

anon = ->


  IT '/about => OK', ->
    PAGE '/about', { authenticated: false }, (html) ->
      EXPECT.contains(html,'<h1>About</h1>')
      DONE()


  IT '/contact => NotFound', ->
    PAGE '/contact', { status: 404, authenticated: false }, (text) ->
      EXPECT.contains(text,'Cannot GET')
      DONE()


module.exports = ->

  DESCRIBE("ANONYMOUS", anon)
