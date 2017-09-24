module.exports = function(name, opts) {

  let start;
  let log = OPTS.log.runner
  let file = join(OPTS.config.paths.specs, name)

  describe.call(this, log.screamed(name), function() {

    before(function() {
      start = new Date
      log.indent()
      log.scope.push(name.toUpperCase())
    })

    after(function() {
      console.log(log.padded(`TIME (${new Date()-start}ms)`.speed))
      log.unpad()
      log.scope.pop()
    })

    require(file)(opts)

  })

}
