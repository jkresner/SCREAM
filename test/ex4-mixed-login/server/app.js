function run(config, done) {

  var {http,test}            = config
  var logic                  = { oauth: require('./logic/auth/oauth') }
  var mw                     = require(`./middleware`)(config)
  var bodyParser             = require(`body-parser`)
  var session                = require(`express-session`)
  var express                = require(`express`)
  var app                    = express()
  var passport               = require('passport')
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((session, cb) => cb(null, session))


  app.set('view engine', 'hbs')
     .set(`views`, __dirname)

     .use(bodyParser.json())
     .use(session(config.http.session))
     .use(passport.initialize())
     .use(passport.session())

     .get('/', mw.page)
     .get('/dashboard', mw.authd, mw.page)

     .post('/auth/login', mw.admit(logic.oauth))

  if (test) {
    test.login.logic = logic.oauth
    app.post(test.login.url, mw.admit(test.login.handler))
  }

  return app
    .use(mw.notFound)
    .use(mw.error)
    .listen(http.port, done).on('error', done)

}


module.exports = { run }
