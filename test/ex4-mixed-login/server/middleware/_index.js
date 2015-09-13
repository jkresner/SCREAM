'use strict';

class Middleware {


  constructor(app, logic) {
  }


  lazy(group, dependencies) {
    if (!this[`_${group}`])
      this[`_${group}`] = this.load(group,dependencies)
    return this[`_${group}`]
  }


  load(namespace, dependencies) {
    return require(`./${namespace}`)(dependencies)
  }


  get res() { return this.lazy(`res`, { ResUtil: this.ResUtil} ) }


}


module.exports = (app, logic) => new Middleware(app, logic)
