

get = ->


  IT 'Get user by id', ->
    GET "/users/#{FIXTURE.users.jkg._id}", (jkg) ->
      EXPECT.equalIds(jkg._id, FIXTURE.users.jkg._id)
      EXPECT.equalIdAttrs(jkg, FIXTURE.users.jkg)
      expect(jkg.name).to.inc("Jonathon")
      DONE()


module.exports = ->

  DESCRIBE("API", get)
