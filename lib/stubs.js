var emptyStub = () => sinon.stub({fake:()=>{}},'fake', ()=>{})


module.exports = ({Path,Fs}, cfg, db) => ({

  stubs: [],

  cb(obj, fnName, data) {

    var stub = sinon.stub(obj, fnName, function() {
      var cb = [].slice.call(arguments).pop()
      cb(null, data)
    })

    // We automatically restore stubs after each test
    STUB.stubs.push(stub)

    return stub
  },

  createStubApiWrapper(wrapperName, stubCallback) {
    return (fnName, result) => {
      if (!cfg.stubs.on) return emptyStub()
      if (!Wrappers[wrapperName].api) Wrappers[wrapperName].init()
      // return sinon.stub(_.get(Wrappers[wrapperName], fnIdx), args, (payload, cb) => {
      $log('Wrappers', wrapperName, fnName, Wrappers.Slack)
      return sinon.stub(Wrappers[wrapperName], fnName, stubCallback(result, fnName))
    }
  },

  stubApiWrapper(wrapperName, fnIdx, args, response) {
    if (!cfg.stubs.on) return emptyStub()
    if (!Wrappers[wrapperName].api) Wrappers[wrapperName].init()
    return sinon.stub(_.get(Wrappers[wrapperName].api, fnIdx), args, (payload, cb) => {
      cb(null, response)
    })
  }


})
