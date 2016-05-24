module.exports = function(login) {
  if (!login) return


  Object.assign(login.test, {

    handler(req, res, next) {
      login.fn.call(req, req.body, (e, user) => {
        if (e) return next(e)
        req.locals.r = user
        req.logIn( user, next )
      })
    }

  })

  OPTS.log.setup('HTTP', `LOGIN ${login.test.url}`)

  return function(data, opts, cb)
  {
    if (data && data.constructor === String)
      data = { key: data }

    if (!cb && opts.constructor === Function) {
      cb = opts
      opts = null
    }

    if (login.clearSessions && !(opts && opts.retainSession))
      global.COOKIE = null
    else if (opts && opts.retainSession === false)
      global.COOKIE = null

    opts = Object.assign({ status: 200, contentType: /json/ }, opts||{})
    SUBMIT(login.test.url || '/login', data, opts, cb)
  }
}
