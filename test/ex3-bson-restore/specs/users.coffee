

get = ->


  IT 'Get user by id', ->
    GET "/users/#{FIXTURE.users.jkg._id}", (jkg) ->
      expect(jkg._id).eqId(FIXTURE.users.jkg._id)
      expect(jkg).eqId(FIXTURE.users.jkg)
      expect(jkg.name).to.inc("Jonathon")
      DONE()


module.exports = ->

  DESCRIBE("API", get)
