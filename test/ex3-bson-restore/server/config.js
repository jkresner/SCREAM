module.exports = function(env) {

  return {
    env,
    appViewDir:        'views',
    mongo: {
      url:             'mongodb://localhost/',
      dbName:          'scream-ex3'
    },          
    http: {
      port:             3102,
    }
  }

}
