module.exports = function(env) {

  return {
    config: {
      env:              env,
      appViewDir:       'views',
      mongoUrl:         'mongodb://localhost/scream-ex2-test',
      http: {
        port:            3102,
      }
    }
  }

}
