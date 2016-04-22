module.exports = (appConfig) ->
  loginConfig =
    testUrl:      '/auth/test/login'
    testHandler:  (req, res, cb) ->
      console.log('login.testHandler'.white, req.body)
      profile = FIXTURE.users[req.body.key].linked.gh
      global.config.auth.test.loginFn.call req, 'gh', profile, cb

  loginConfig
