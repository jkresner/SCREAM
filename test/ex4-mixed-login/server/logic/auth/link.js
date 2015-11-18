
module.exports = function() {

  function loginGithub(profile, cb) {
    var r = null
    for (var key in FIXTURE.users)
      if (FIXTURE.users[key].linked.gh.login == profile.login) r = FIXTURE.users[key]
    cb(null, r)
  }


  return {

    // validation(user, provider, profile) {},

    logic(provider, profile, done) {
      return loginGithub.call(this, profile, done)
    }

  }

}
