module.exports = ->

  IT '/about => OK', ->
    PAGE '/about', { session: null }, (html) ->
      expect(html).inc '<h1>About</h1>'
      DONE()


  IT '/contact => NotFound', ->
    PAGE '/contact', { status: 404, session: null }, (text) ->
      expect(text).inc 'Cannot GET'
      DONE()
