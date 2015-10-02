module.exports = (req, callback) ->
  fn = require('./server/logic/auth/link')().logic
  fn.call(req, 'gh', FIXTURE.users[req.body.key].linked.gh, callback)
