appConfig =
  appViewDir:               "#{__dirname}/server/views"
  auth:
    loginUrl:               '/'
    loggedinUrl:            '/'
    test:
      loginUrl:             '/test/auth/login'
  http:
    port:                   3104
    session:
      saveUninitialized:    true
      resave:               false
      name:                 'mirco-consult'
      secret:               'mirco-consulting'
      cookie:               { httpOnly: true, maxAge: 9000000 }

login = require('./login')

SCREAM          = require('../../lib/index')
SCREAM(__dirname, appConfig, {login}).run()
