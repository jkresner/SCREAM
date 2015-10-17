function login(cfg, appConfig, loginLogic) {
  if (loginLogic)
  {
    var url = cfg.login ? cfg.login.url : null
    var loginUrl = url || '/scream/login'

    appConfig.auth.test = {
      loginUrl,
      loginHandler: function(req, res, next) {
        loginLogic(req, (e, user) => {
          if (e) return next(e)
          req.logIn( user, ee => res.json(user) )
        })
      }
    }

    return function(data, opts, cb)
    {
      if (!cb && opts.constructor === Function) {
        cb = opts
        opts = null
      }

      if (!opts || !opts.retainSession)
        global.COOKIE = null

      SUBMIT(`/auth${loginUrl}`, data, opts||{}, cb)
    }
  }

}

module.exports = login
