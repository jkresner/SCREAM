module.exports = function(profile, cb) {
  for (var key in FIXTURE.users) {
    if (FIXTURE.users[key].linked.gh.login == profile.login)
      r = FIXTURE.users[key]
  }
  cb(null, r)
}
