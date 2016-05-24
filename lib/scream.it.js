log = OPTS.log.runner


var itWrap = fn => function(done) {
  global.DONE = done

  this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
  this.testSeed = moment().format('X')

  if (OPTS.config.verbose)
    console.log(log.padded(`✓ ${this.test.title} ${this.testSeed}`.spec.dim))

  this.todo = str => OPTS.config.muted ? 1 :
    console.log(log.padded(`✓ `.todo+"expect${str} ".spec.dim+"(todo)".todo))

  fn.call(this, done)
}


module.exports = function(title, fn) { it(title, itWrap(fn)) }

module.exports.only = function(title, fn) { it.only(title, itWrap(fn)) }

module.exports.skip = function(title) { it.skip(title) }
