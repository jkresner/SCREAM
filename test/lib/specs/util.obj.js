var ObjUtil              = require('../../../lib/_util').Obj

var admin = {
  "_id" : "54551be15f221efa174448d1",
  "auth":{
    "gp": {
      "id" : "199992380360999999999",
      "email" : "admin@airpair.com",
      "name" : "Admin Daemon",
    },
    "gh" : {
      "login" : "airpairadm",
      "id" : 11262312,
      "emails": [{ email: "admin@ap.com", verified: true, primary: true }],
    }
  },
  "email" : "ad@airpair.com",
  "name" : "Admin Daemon",
}


module.exports = () => {


describe.only("OBJECT", function() {


  it('GET prop', function(done) {
    expect(ObjUtil.get(admin,'email')).to.equal("ad@airpair.com")
    done()
  })


  it('Get nested props', function(done) {
    expect(ObjUtil.get(admin,'auth.gp').email).to.equal("admin@airpair.com")
    expect(ObjUtil.get(admin,'auth.gp.email')).to.equal("admin@airpair.com")
    expect(ObjUtil.get(admin,'auth.gh.id')).to.equal(11262312)
    done()
  })


  SKIP('Get nested array elem prop', function(done) {
    expect(ObjUtil.get(admin,'auth.gh.emails.email')[0]).to.equal("admin@ap.com")
    done()
  })


})


}
