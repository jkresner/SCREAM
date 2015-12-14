module.exports = function(cfg) {

  var apiUrl = cfg.http.api.urlPath || '/api'

  var http                     = require('supertest')

  global.COOKIE                = null // used for maintaining logged in sessions

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

    if (cfg.verbose) console.log(`${httpCall.method.toUpperCase()}\t`.gray, httpCall.url.cyan)
    if (opts.referer) httpCall.set('referer', opts.referer)

    httpCall
      .set('cookie', opts.unauthenticated ? null : global.COOKIE)
      .set('user-agent', opts.ua || 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0')
      .expect('Content-Type', opts.contentType || /json/)
      .expect(opts.status || 200)
      .end(function(e,resp) {
        if (e) {
          console.log('\nFailed HTTP expect on'.red, resp.request.req.path.white)
          if (cfg.verbose) console.log('--'.white, resp.res.body||resp.res.text, '\n--\n'.white)
          return DONE(e)
        }
        try {
          if (global.COOKIE == null)
            global.COOKIE = resp.headers['set-cookie']
          cb.call(this, resp.res.body||resp.res.text)
        } catch (err) {
          return DONE(err)
        }
      })
  }

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

}
