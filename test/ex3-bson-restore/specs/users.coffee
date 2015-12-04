

get = ->


  IT 'Get user by id', ->
    GET "/users/#{FIXTURE.users.jkg._id}", (jkg) ->
      EXPECT.equalIds(jkg._id, FIXTURE.users.jkg._id)
      EXPECT.equalIdAttrs(jkg, FIXTURE.users.jkg)
      expect(jkg.name).to.equal("Jonathon Kresner")
      DONE()


module.exports = ->

  DESCRIBE("API", get)
