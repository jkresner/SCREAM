 function run(appConfig, done) {

  global.config              = appConfig

  var express                = require(`express`)
  var app                    = express()

  app.set(`views`, config.appViewDir)
  app.set(`view engine`, `hbs`)


  require(`./collections`).Connect((e,db)=> {

    app.get("/api/users/:id", (req,res,next)=>
      db.Users.findOne({_id:ObjectId(req.params.id)},(e,r)=>res.json(r))
    )

    var cb = done || (e => {})
    app.listen(config.http.port, cb).on('error', cb)

  })

  return app
}


module.exports = { run }
