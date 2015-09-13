

get = ->


  IT 'Get user by id', ->
    GET "/users/#{FIXTURE.users.jkg._id}", (jkg) ->
      expectIdsEqual(jkg._id, FIXTURE.users.jkg._id)
      expect(jkg.name).to.equal("Jonathon Kresner")
      DONE()


module.exports = ->

  DESCRIBE("API", get)
