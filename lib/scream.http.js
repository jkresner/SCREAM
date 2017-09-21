module.exports = function() {

  let {verbose}                = OPTS.config.log
  var http                     = require('supertest')
  var optsMerge = {
    api: (opts, cb) => assign({ accept: 'application/json' }, cb?opts:{})
  }

  global.COOKIE                = null // maintains sessions

  global.LOGOUT = cb => {
    global.COOKIE = null
    if (cb) cb()
  }

  var _call = (httpCall, opts, cb) => {
    if (!cb && opts.constructor === Function) {
      cb = opts
      opts = {}
    }

    if (opts.accept) httpCall.set('accept', opts.accept)
    if (opts.referer) httpCall.set('referer', opts.referer)
    if (!opts.contentType && opts.accept) {
      if (/text/.test(opts.accept)) opts.contentType = /text/
      if (/html/.test(opts.accept)) opts.contentType = /html/
    }

    if (verbose)
      console.log(`${httpCall.method.substring(0,3)}${httpCall.url.replace('http://127.0.0.1','')}`.white.dim +
        `${JSON.stringify(opts).replace(/\"([^(\")"]+)\":/g,"$1:").replace(/(^\{|\}$|,)/g,' ')}`.gray.dim)

    if (opts.session === null)
      global.COOKIE = null


    httpCall
      .set('cookie', global.COOKIE)
      .set('user-agent', opts.ua || 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
      .expect(opts.status || 200)
      .expect('Content-Type', opts.contentType || /json/)
      .end(function(e, resp) {
        if (e) {
          console.log(`\n${resp.request.method.toUpperCase()}[${resp.request.req.path}] ${e.message}\n`.error)
          if (verbose) console.log(`--body\n`.white, resp.res.body||resp.res.text, '\n--'.white)
          if (DONE) return DONE(e)
        }

        if (global.COOKIE == null && resp.headers['set-cookie'])
            global.COOKIE = resp.headers['set-cookie']

        cb(/json/.test(resp.type) ? resp.body : resp.text)
      })
  }

  //-- Shorthand syntax for expected resp opts
  //   PAGE('/inbox', RES(403,/json/), (resp) => {})
  var _res = function(status, contentType, opts) {
    if (!contentType)
      contentType = /html/
    else if (contentType.constructor == Object) {
      opts = contentType
      contentType = /html/
    }

    return assign({status,contentType},opts||{})
  }
  global.RES = _res

  var apiUrl = OPTS.config.http.api.baseUrl || '/api'

  global.PAGE = (url, opts, cb) =>
    _call(http(global.APP)[(opts||{}).method||'get'](url), assign({ contentType: /text/ }, opts||{}), cb)

  global.SUBMIT = (url, data, opts, cb) =>
    _call(http(global.APP).post(url).send(data), opts, cb)

  global.GET = (url, opts, cb) =>
    _call(http(global.APP).get(`${apiUrl}${url}`), optsMerge.api(opts,cb), cb||opts)

  global.POST = (url, data, opts, cb) =>
    _call(http(global.APP).post(`${apiUrl}${url}`).send(data), optsMerge.api(opts,cb), cb||opts)

  global.PUT = (url, data, opts, cb) =>
    _call(http(global.APP).put(`${apiUrl}${url}`).send(data), optsMerge.api(opts,cb), cb||opts)

  global.DELETE = (url, opts, cb) =>
    _call(http(global.APP).delete(`${apiUrl}${url}`), optsMerge.api(opts,cb), cb||opts)

  global.REDIRECT = (url, opts, cb) =>
    _call(http(global.APP).get(url), assign({ accept: "text/plain", status: 302 }, opts||{}), cb)

  if (OPTS.login)
    global.LOGIN = function(data, opts, cb) {
      if (data && data.constructor === String) data = { key: data }
      if (!cb && opts && opts.constructor === Function) {
        cb = opts
        opts = {}
      }

      //-- If login with a completely different user
      //-- we don't want to reuse sessionID from previous user
      //-- Terse alternative to calling LOGOUT between LOGINS
      if (!opts.hasOwnProperty('session') && OPTS.login.hasOwnProperty('session'))
        opts.session = OPTS.login.session

      accept = OPTS.login.accept || "text/plain"
      status = OPTS.login.status || /json/.test(accept) ? 200 : 302
      opts = assign({ status, accept }, opts)

      SUBMIT(OPTS.login.url, data, opts, cb)
    }


  if (OPTS.oauth) {
    global.OAUTH = function(data, opts, cb) {
      if (!cb && opts.constructor === Function) {
        cb = opts
        opts = {}
      }

      status = OPTS.oauth.status || 302
      accept = OPTS.oauth.accept || "text/plain"
      opts = assign({ status, accept }, opts)
      SUBMIT(OPTS.oauth.url, data, opts, cb)
    }
  }


  OPTS.log.info('HTTP', `app ${OPTS.login?'+ login':''} ${OPTS.oauth?'+ oauth':''}`)
}
