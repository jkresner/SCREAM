appConfig =
  appViewDir:               "#{__dirname}/server/views"
  auth:
    loginUrl:               '/'
    loggedinUrl:            '/'
    test:
      loginFnName:          'link'
  http:
    port:                   3104
    session:
      saveUninitialized:    true
      resave:               false
      name:                 'mirco-consult'
      secret:               'mirco-consulting'
      cookie:               { httpOnly: true, maxAge: 9000000 }


OPTS =
  login: require('./login')(appConfig)


SCREAM = require('../../lib/index')(__dirname, OPTS)
SCREAM.run({config:appConfig})
