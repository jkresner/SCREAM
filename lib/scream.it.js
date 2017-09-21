

var itWrap = fn => function(done) {
  let {verbose,quiet} = OPTS.config.log
  let {padded} = OPTS.log.runner
  global.DONE = done
  this.testKey = this.test.title.toLowerCase().replace(/ /g,'-')
  this.testSeed = moment().format('X')
  global.TEST = this.test
  if (verbose)
    console.log(padded(` > ${this.test.title} ${this.testSeed}`.spec.dim))

  this.todo = str => quiet ? 1 :
    console.log(padded(` ✓ `.todo+`${str} `.spec.dim+`(todo)`.todo))

  fn.call(this, done)
}


module.exports = function(title, fn) { it(title, itWrap(fn)) }

module.exports.only = function(title, fn) { it.only(title, itWrap(fn)) }

module.exports.skip = function(title) { it.skip(title) }
