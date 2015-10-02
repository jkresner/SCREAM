SCREAM          = require('../../index')


appConfig =
  appViewDir:               "#{__dirname}/server/views"
  auth:
    loginUrl:               '/'
    loggedinUrl:            '/'
  http:
    port:                   3104
    session:
      saveUninitialized:    true
      resave:               false
      name:                 'mirco-consult'
      secret:               'mirco-consulting'
      cookie:               { httpOnly: true, maxAge: 9000000 }


loginLogic = require('./login')




SCREAM(__dirname, appConfig, loginLogic).run()
