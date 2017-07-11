module.exports = function() {

  var http                     = require('supertest')

  global.COOKIE                = null // maintains sessions

  global.LOGOUT = (cb) => {
    global.COOKIE = null
    if (cb) cb()
  }

  global.NEWSESSION = (userKey) => {
    sessionID = `test${userKey}${moment().format('X')}`
    session = {
      cookie: {
        originalMaxAge: 2419200000,
        _expires: moment().add(2419200000, 'ms').subtract(1,'s')
      }
    }
    return {sessionID,session}
  }

  var _call = (httpCall, opts, cb) => {
    if (!cb && opts.constructor === Function) {
      cb = opts
      opts = {}
    }

    if (OPTS.config.verbose)
      console.log(`${httpCall.method}${httpCall.url.replace('http://127.0.0.1','')}`.white.dim, opts)

    if (opts.referer) httpCall.set('referer', opts.referer)

    httpCall
      .set('cookie', opts.unauthenticated === true ? null : global.COOKIE)
      .set('user-agent', opts.ua || 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
      .expect(opts.status || 200)
      .expect('Content-Type', opts.contentType || /json/)
      .end(function(e, resp) {
        if (e) {
          console.log(`\n${resp.request.method.toUpperCase()}[${resp.request.req.path}] ${e.message}\n`.error)
          if (OPTS.config.verbose) console.log(`--body\n`.white, resp.res.body||resp.res.text, '\n--'.white)
          if (DONE!=undefined) return DONE(e)
        }
        // try {
        // $log('setting.cookie'.magenta, resp.headers['set-cookie'])
        if (global.COOKIE == null && resp.headers['set-cookie'])
            global.COOKIE = resp.headers['set-cookie']

        cb(resp.type.match(/json/) ? resp.body : resp.text)
        // } catch (err) {
        //   console.log('http.err,DONE'.yellow, err)
        //   if (DONE!=undefined) return DONE(err)
        // }
      })
  }

  //-- Shorthand syntax for expected resp opts
  //   RES(403,/json/)
  var _res = function(status, contentType, opts) {
    if (!contentType)
      contentType = /html/
    else if (contentType.constructor == Object) {
      opts = contentType
      contentType = /html/
    }

    return Object.assign({status,contentType},opts||{})
  }
  global.RES = _res

  var apiUrl = OPTS.config.http.api.baseUrl || '/api'

  global.PAGE = (url, opts, cb) =>
    _call(http(global.APP).get(url), Object.assign({ contentType: /text/ }, opts||{}), cb)

  global.SUBMIT = (url, data, opts, cb) =>
    _call(http(global.APP).post(url).send(data), opts, cb)

  global.GET = (url, opts, cb) =>
    _call(http(global.APP).get(`${apiUrl}${url}`), opts, cb)

  global.POST = (url, data, opts, cb) =>
    _call(http(global.APP).post(`${apiUrl}${url}`).send(data), opts, cb)

  global.PUT = (url, data, opts, cb) =>
    _call(http(global.APP).put(`${apiUrl}${url}`).send(data), opts, cb)

  global.DELETE = (url, opts, cb) =>
    _call(http(global.APP).delete(`${apiUrl}${url}`), opts, cb)


  if (OPTS.login) {
    Object.assign(OPTS.login.test, {
      handler(req, res, next) {
        OPTS.login.fn.call(req, req.body, (e, user) => {
          if (e) return next(e)
          req.locals.r = user
          req.logIn( user, next )
        })
      }
    })

    global.LOGIN = function(data, opts, cb) {
      if (data && data.constructor === String) data = { key: data }
      if (!cb && opts && opts.constructor === Function) {
        cb = opts
        opts = {}
      }

      if (OPTS.login.clearSessions && !(opts && opts.retainSession))
        global.COOKIE = null
      else if (opts && opts.retainSession === false)
        global.COOKIE = null

      opts = Object.assign({ status: 200, contentType: /json/ }, opts||{})

      SUBMIT(OPTS.login.test.url || '/login', data, opts, cb)
    }
  }

  if (OPTS.oauth) {
    Object.assign(OPTS.oauth.test, {
      handler(req, res, next) {
        OPTS.oauth.fn.call(req, req.body, next)
      }
    })

    global.OAUTH = function(data, opts, cb) {
      if (!cb && opts.constructor === Function) {
        cb = opts
        opts = {}
      }

      opts = Object.assign({ status: 302, contentType: /text/ }, opts)
      SUBMIT(OPTS.oauth.test.url || '/oauth', data, opts, cb)
    }
  }


  OPTS.log.setup('HTTP', `app`)
}
