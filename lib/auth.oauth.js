module.exports = function(deps, {oauth}, appConfig) {
  if (!oauth || !appConfig || !appConfig.auth) return

  var oauthUrl = oauth.testUrl || '/oauth'
  appConfig.auth.test = Object.assign(appConfig.auth.test||{}, {
    oauthUrl,
    oauthHandler(req, res, next) {
      oauth.testHandler(req, res, next)
    }
  })

  return function(data, opts, cb)
  {
    if (!cb && opts.constructor === Function) {
      cb = opts
      opts = null
    }

    opts = Object.assign({ status: 302, contentType: /text/ }, opts || {})
    SUBMIT(oauthUrl, data, opts, cb)
  }
}

