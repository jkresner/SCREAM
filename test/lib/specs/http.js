const express = require("express")

module.exports = () => {

  before(function(done) {
    global.APP = express()
    global.OPTS = {
      config: { 
        http: { api: { baseUrl: '/test-api/' } },
        log: { setup: x => {} },
      },
      log: { info() {}, flags() {} }
    }
    require('../../../lib/scream.http')()
    done()
  })


describe("HTML", function() {

  it.skip("expect().PAGE")
  it.skip("expect().SUBMIT")
  it.skip("expect().REDIRECT")
  
})


describe("API", function() {

  it.skip("expect().GET")
  it.skip("expect().POST")
  it.skip("expect().PUT")
  it.skip("expect().DELETE")

})


describe("AUTH", function() {

  it.skip("expect().COOKIE")
  it.skip("expect().LOGIN")
  it.skip("expect().LOGOUT")
  it.skip("expect().OAUTH")

})


}
