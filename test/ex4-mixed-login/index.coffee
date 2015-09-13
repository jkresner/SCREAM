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


loginLogic = (req, callback) ->
  fn = require('./server/logic/auth/link')().logic
  fn.call(req, 'gh', FIXTURE.users[req.body.key].linked.gh, callback)



SCREAM(__dirname, appConfig, loginLogic).run()
