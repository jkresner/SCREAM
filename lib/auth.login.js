module.exports = function(deps, {login}, appConfig) {
  if (!login || !appConfig || !appConfig.auth) return

  var loginUrl = '/test/auth/login'
  // var url = cfg.login ? cfg.login.url : null

  appConfig.auth.test = Object.assign(appConfig.auth.test||{}, {
    loginUrl,
    loginHandler(req, res, next) {
      login(req, (e, user) => {
        if (e) return next(e)
        req.logIn( user, ee => res.json(user) )
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

    if (!opts || !opts.retainSession)
      global.COOKIE = null

    SUBMIT(`${loginUrl}`, data, opts||{}, cb)
  }
}
