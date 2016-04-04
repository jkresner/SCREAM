module.exports = function(deps, {login}, appConfig) {
  if (!login || !appConfig || !appConfig.auth) return

  var loginUrl = '/login'
  // var url = cfg.login ? cfg.login.url : null

  appConfig.auth.test = Object.assign(appConfig.auth.test||{}, {
    loginUrl,
    loginHandler(req, res, next) {
      login(req, (e, user) => {
        if (e) return next(e)
        req.locals.r = user
        req.logIn( user, next )
      })
    }
  })

  return function(data, opts, cb)
  {
    if (data && data.constructor === String)
      data = { key: data }

    if (!cb && opts.constructor === Function) {
      cb = opts
      opts = null
    }

    if (opts && opts.retainSession === false)
      global.COOKIE = null

    SUBMIT(`/test/auth${loginUrl}`, data, opts||{}, cb)
  }
}
