/*
*   DESCRIBE is similar to SPEC:
*   - without being based as a file in paths.specs so one can structure
*      sub specs in any desired directory / file layout
*   - no timer feedback
*   - .subspec color customization :[]
*                                                                            */
let log = OPTS.log.runner

module.exports = function(title, fn) {

  describe.call(this, log.screamed(title), function() {

    before(() => {
      log.indent(title)
      log.scope.push(title.toUpperCase())
    })

    after(() => {
      log.unpad()
      log.scope.pop()
    })

    fn()

  })

}

module.exports.only = function(title, fn) { describe.only(log.screamed(title), fn) }

module.exports.skip = function(title, fn) { describe.skip(log.screamed(title), fn) }
