SCREAM                      = require('../../lib/index')


opts =
  login:
    url:                   '/auth/test/login'
    handler: (data, cb) ->
      user = FIXTURE.users[data.key]
      profile = user.linked.gh
      opts.login.logic.call @, profile, cb


SCREAM(opts).run (done) ->

  config =
    auth:
      loginUrl:               '/login'
      loggedinUrl:            '/dashboard'
    http:
      port:                   3104
      session:
        saveUninitialized:    true
        resave:               false
        name:                 'mirco-consult'
        secret:               'mirco-consulting'
        cookie:               maxAge: 9000000
    test:
      login:                opts.login

  require('./server/app').run(config, done)
