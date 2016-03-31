 function run({config}, done) {

  global.config              = config

  var express                = require(`express`)
  var app                    = express()

  app.set(`views`, config.appViewDir)
  app.set(`view engine`, `hbs`)

  require(`./collections`).Connect((e,db) => {

    app.get("/about", (req,res,next)=>res.send("<h1>About</h1>"))

    var cb = done || (e => {})
    app.listen(config.http.port, cb).on('error', cb)

  })

  return app
}


module.exports = { run }
