module.exports = ({auth}) => ({


  admit(logic) {
    return (req, res, next) =>
      logic(req.body, (e, user) =>
        req.logIn(user, () => {
          var redirectUrl = auth.loggedinUrl
          if ((req.session||{}).returnTo) {
            redirectUrl = req.session.returnTo
            delete req.session.returnTo
          }
          res.type("text").redirect(redirectUrl)
        }))
  },


  authd(req, res, next) {
    if (req.user)
      return next()

    if (req.session)
      req.session.returnTo = req.url

    res.type("text").redirect(`${auth.loginUrl}`)
  },


  notFound(req, res, next) {
    var e = Error(`Resource not found at ${req.originalUrl}`)
    next(Object.assign(e, {status:404}))
  },


  page(req, res, next) {
    var authenticated = (req.user && req.isAuthenticated()) === true
    var data = {authenticated,sessionID:req.sessionID}
    if (req.user) data.user = req.user
    res.render('index', data)
  },


  error(e, req, res, next) {
    console.log('error.mw', e.stack)
    res.status(e.status || 400)
    req.locals = Object.assign(req.locals||{},{error:e})
    res.render('error', e)
  }


})
