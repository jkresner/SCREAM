
var StatusError = (message, status) => {
  var e = new Error(message)
  e.status = status
  return e
}

var mw = {

  notFound() {
    return function(req, res, next) {
      next(StatusError(`Resource not found at ${req.originalUrl}`, 404))
    }
  },

  unauthorized(unauthorizedFn, redirectFn) {
    unauthorizedFn = unauthorizedFn || ((usr) => !usr)
    redirectFn = redirectFn || ((r) => `${config.auth.loginUrl}?returnTo=${r.originalUrl}`)

    return function(req, res, next) {

      if (!unauthorizedFn(req.user))
        return next()

      if (req.originalUrl.indexOf('/api/') > -1)
        return res.status(401).json({})

      if (req.session)
        req.session.returnTo = req.url

      res.redirect(redirectFn(req))
    }
  },

  page(name) {
    return function(req, res, next) {
      var authenticated = (req.user && req.isAuthenticated()) === true
      req.locals = Object.assign(req.locals||{},{authenticated,user:req.user})
      res.render(name || 'index', req.locals)
    }
  },

  error() {
    return function(e, req, res, next) {
      res.status(e.status || 400)

      if (e.status == 404)
        return res.sendStatus(404)

      req.locals = Object.assign(req.locals||{},{error:e})
      return mw.page('error')(req,res,next)
    }
  },


}

module.exports = () => {
  return mw
}
