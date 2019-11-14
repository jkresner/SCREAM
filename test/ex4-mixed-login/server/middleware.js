module.exports = ({auth}) => ({


  admit(logic) {
    return (req, res, next) =>
      logic(req.body, (e, user) =>
        req.logIn(user, () => {
          var redirectUrl = auth.loggedinUrl
          if ((req.session||{}).returnTo) {
            redirectUrl = req.session.returnTo
            delete req.session.returnTo
          }
          res.type("text").redirect(redirectUrl)
        }))
  },


  authd(req, res, next) {
    if (req.user)
      return next()

    if (req.session)
      req.session.returnTo = req.url

    res.type("text").redirect(`${auth.loginUrl}`)
  },


  notFound(req, res, next) {
    var e = Error(`Resource not found at ${req.originalUrl}`)
    next(Object.assign(e, {status:404}))
  },


  page(req, res, next) {
    var prompt = "Login please"
    var authenticated = (req.user && req.isAuthenticated()) === true    
    if (authenticated) 
      prompt = `Welcome ${req.user.name}!`
  
    res.send(`<h1>Index HBS</h1>
      <p>${prompt}</p>
      <p>{ session:"${req.sessionID}" }</p>`)
  },


  error(e, req, res, next) {
    console.log('error.mw', e.stack)
    res.status(e.status || 400)
    req.locals = Object.assign(req.locals||{},{error:e})
    res.send(`Error HBS\n\n${message}`)
  }


})
