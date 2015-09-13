module.exports = function(env) {

  return {
    config: {
      appViewDir:       'views',
      mongoUrl:         'mongodb://localhost/scream-ex2-test',
      http: {
        port:            3102,
      }
    }
  }

}
