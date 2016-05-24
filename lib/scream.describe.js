/*
*   DESCRIBE is similar to SPEC:
*   - without being based as a file in paths.specs so one can structure
*      sub specs in any desired directory / file layout
*   - no timer feedback
*   - .subspec color customization :[]
*                                                                            */
module.exports = function(title, fn) {

  var log = OPTS.log.runner

  describe.call(this, log.screamed(title).subspec, function() {

    before(log.indent)

    after(log.unpad)

    fn()

  })

}

module.exports.only = function(titlem, fn) { descibe.only(title, fn) }

module.exports.skip = function(title) { descibe.skip(title) }
