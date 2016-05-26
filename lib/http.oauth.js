// module.exports = function(deps, oauth) {
//   if (!oauth) return


//   Object.assign(oauth.test, {

//     handler(req, res, next) {
//       oauth.fn.call(req, req.body, next)
//     }

//   })

//   OPTS.log.setup('HTTP', `oauth`)

//   return function(data, opts, cb)
//   {
//     if (!cb && opts.constructor === Function) {
//       cb = opts
//       opts = null
//     }

//     opts = Object.assign({ status: 302, contentType: /text/ }, opts||{})
//     SUBMIT(oauth.test.url || '/oauth', data, opts, cb)
//   }
// }

