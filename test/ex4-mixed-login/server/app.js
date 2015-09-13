function run(appConfig, done)
{
  global.config              = appConfig

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

  require(`./routes/_index`).init(app, mw)

  app.use(mw.res.notFound())
  app.use(mw.res.error())

  var cb = done || (e => {})
  app.listen(config.http.port, cb).on('error', cb)

  return app
}


module.exports = { run }
