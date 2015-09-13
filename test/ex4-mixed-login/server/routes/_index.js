var Router                    = require('express').Router


function init(app, mw) {

  mw.authd = mw.res.unauthorized()

  var hbs = require('hbs')
  hbs.localsAsTemplateData(app)
  app.locals = Object.assign(app.locals, {})

  app.get('/', // mw.session.setVarFromQuery('returnTo'),
    mw.res.unauthorized(usr => usr, req => '/dashboard'),
    mw.res.page())

  app.get(['/dashboard'], mw.authd, mw.res.page())


  var authRouter = Router()

  if (config.auth.test)
    authRouter.post(config.auth.test.loginUrl, config.auth.test.loginHandler)


  app.use('/auth', authRouter)

}


module.exports = { init }
