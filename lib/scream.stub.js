var types = {

  //-- Place a proxy that doesn't effect behavior
  spy(obj, fnName) {
    return sinon.spy(obj, fnName)
  },

  //-- Procedurally return given data
  sync(obj, fnName, data) {
    return sinon.stub(obj, fnName, () => data)
  },

  //-- Asynchronously return params as callback args
  callback(obj, fnName, params, builder) {
    return sinon.stub(obj, fnName, function() {
      var cb = [].slice.call(arguments).pop()
      if (builder)
        params = builder.apply(this, arguments)
      cb.apply(this, params)
    })
  }

}


// Skip manually restoring stubs / spys by holding them
// in _active to iterate in mocha afterEach handler
var _active = []
var stubs = {
  restoreAll() {
    for (var item of _active) item.restore()
    _active = []
  },
  error() { arguments[2] = [arguments[2]]
    return this.callback.apply(this, arguments) },
  success() { arguments[2] = [null, arguments[2]]
    return this.callback.apply(this, arguments) },
}


module.exports = () => {

  var {on,timeout} = OPTS.config.stubs
  Object.keys(types).forEach(type =>
    stubs[type] = function() {

      if (!on && timeout) TIMEOUT(timeout) // extend timeout when stubbing off

      _active.push(types[on?type:'spy'].apply(this, arguments))
      return _active[_active.length-1]
    })


  stubs.wrapper = name => {
    var wrpr = Wrappers[name]
    if (!wrpr.api) wrpr.init()

    return {
      cb: (fnName, fixtureKey) =>
        stubs.success(wrpr, fnName, FIXTURE.clone(`wrappers.${fixtureKey}`)),

      // apiFnPath:
      // - can be as simple as:   Stackoverflow.api."get"
      // - can be nested like:    GitHub.api."orgs.addTeamMembership"
      api(apiFnPath) {
        var fnPathParts = apiFnPath.split('.')
        var fnName = fnPathParts.pop()
        var fnObj = wrpr.api
        while (fnPathParts.length > 0) {
          var subObj = fnPathParts.shift()
          fnObj = fnObj[subObj]
        }
        return {
          err: e => stubs.error(fnObj, fnName, FIXTURE.wrappers[e]||e),
          fix: key => stubs.success(fnObj, fnName, FIXTURE.wrappers[key]),
          params() { return stubs.callback(fnObj, fnName, arguments) },
          fromCtx(builder) { return stubs.callback(fnObj, fnName, null, builder) }
        }
      }
    }

  }

  return stubs

}
