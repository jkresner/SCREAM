module.exports = function(name, opts, log) {

  var start;
  var log = OPTS.log.runner
  var file = deps.Path.join(OPTS.config.paths.specs, name)

  describe.call(this, log.screamed(name), function() {

    before(function() {
      start = new Date
      log.indent()
    })

    after(function() {
      console.log(`${pad}TIME (${new Date()-start}ms)`.speed)
      log.unpad()
    })

    require(file)(opts)

  })

}
