appConfig =
  appViewDir:               "#{__dirname}/server/views"
  auth:
    loginUrl:               '/auth/login'
    loggedinUrl:            '/'
    test:
      login:
        fnName:               'link'
        url:                  '/login'
  http:
    port:                   3104
    session:
      saveUninitialized:    true
      resave:               false
      name:                 'mirco-consult'
      secret:               'mirco-consulting'
      cookie:               { httpOnly: true, maxAge: 9000000 }

OPTS =
  login:
    clearSessions: true
    test: appConfig.auth.test
    fn: (data, cb) ->
      console.log('login.testHandler'.white, req.body)
      profile = FIXTURE.users[req.body.key].linked.gh
      token = _.get(profile,"tokens.athr.token") || "test"
      config.test.auth.loginFn.call @, 'gh', profile, {token}, cb


SCREAM = require('../../lib/index')(OPTS)
SCREAM.run (done) ->
  require('./server/app').run {config:appConfig,done}
