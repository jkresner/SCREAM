function run({config,done})
{
  global.config              = config

  var express                = require(`express`)
  var app                    = express()

  app.set(`views`, config.appViewDir)
  app.set(`view engine`, `hbs`)


  var cookieParser           = require(`cookie-parser`)
  var bodyParser             = require(`body-parser`)
  var session                = require(`express-session`)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cookieParser(config.http.session.secret))
  app.use(session(config.http.session))

  var mw                   = require(`./middleware/_index`)(app)

  var passport             = require('passport')
  passport.serializeUser((u,cb)=>cb(null,{_id:u._id, name:u.name}))
  passport.deserializeUser((session,cb)=>cb(null,session))
  app.use(passport.initialize())
  app.use(passport.session())


  var hbs = require('hbs')
  hbs.localsAsTemplateData(app)
  app.locals = Object.assign(app.locals, {})

  mw.authd = mw.res.unauthorized()
  app.get('/', mw.res.unauthorized(usr => usr, req => '/dashboard'), mw.res.page())
  app.get(['/dashboard'], mw.authd, mw.res.page())


  console.log('config.auth', config.auth)
  app.post(config.auth.loginUrl, require('./logic/auth/link')().exec)
  app.post(config.auth.test.login.url, require('./logic/auth/link')().exec)


  app.use(mw.res.notFound())
  app.use(mw.res.error())

  var cb = done || (e => {})
  app.listen(config.http.port, cb).on('error', cb)

  return app
}


module.exports = { run }
