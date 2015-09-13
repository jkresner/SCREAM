
module.exports = function() {

  var Forbidden = (message) => {
    var e = new Error(message)
    e.status = 403
    return e
  }

  function loginGithub(profile, cb) {
    var r = null
    for (var key in FIXTURE.users)
      if (FIXTURE.users[key].linked.gh.login == profile.login) r = FIXTURE.users[key]
    cb(null, r)
  }


  return {

    // validation(user, provider, profile) {},

    logic(provider, profile, done) {
      if (!this.user && provider == 'gh')
        return loginGithub.call(this, profile, done)

      done(Forbidden("Github login is the only oAuth supported action atm."))
    }

    // view: Select.me

  }

}
