module.exports = function(env) {

  return {
    env,
    appViewDir:        'views',
    mongoUri:          'mongodb://localhost/scream-ex3',
    http: {
      port:             3102,
    }
  }

}
