function login(cfg, appConfig, loginLogic) {
  var loginUrl = url || '/test/auth/login'
  if (loginLogic)
  {
    var url = cfg.login ? cfg.login.url : null

    appConfig.auth.test = Object.assign(appConfig.auth.test||{}, {
      loginUrl,
      loginHandler(req, res, next) {
        loginLogic(req, (e, user) => {
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
}

function oauth(cfg, appConfig, oauthLogic) {
  var oauthUrl = '/test/auth/oauth'
  if (oauthLogic)
  {
    appConfig.auth.test = Object.assign(appConfig.auth.test||{}, {
      oauthUrl,
      oauthHandler(req, res, next) { oauthLogic(req, next) }
    })

    return function(data, opts, cb)
    {
      if (!cb && opts.constructor === Function) {
        cb = opts
        opts = null
      }

      SUBMIT(`${oauthUrl}`, data, Object.assign({ status: 302, contentType: /text/ }, opts||{}), cb)
    }
  }
}


module.exports = {login,oauth}
