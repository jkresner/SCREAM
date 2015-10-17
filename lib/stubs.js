var emptyStub = () => sinon.stub({fake:()=>{}},'fake', ()=>{})


module.exports = ({Path,Fs,ObjUtil}, cfg, db) => ({

  spys: [],
  stubs: [],

  spy(obj, fnName) {
    var spy = sinon.spy(obj, fnName)

    // Hold to auto restore spy after each test
    STUB.stubs.push(obj[fnName])

    return obj[fnName]
  },

  cb(obj, fnName, data) {

    var stub = sinon.stub(obj, fnName, function() {
      var cb = [].slice.call(arguments).pop()
      cb(null, data)
    })

    // Hold to auto restore stub after each test
    STUB.stubs.push(stub)

    return stub
  },

  sync(obj, fnName, data) {

    var stub = sinon.stub(obj, fnName, () => data)

    // Hold to auto restore stub after each test
    STUB.stubs.push(stub)

    return stub
  },

  stubWrapperAPICall(wrapperName, fnName) {
    return (respCB) => {
      if (!cfg.stubs.on) return emptyStub()
      if (!Wrappers[wrapperName].api) Wrappers[wrapperName].init()

      sinon.stub(Wrappers[wrapperName].api, fnName, respCB)

      // Hold to auto restore stub after each test
      STUB.stubs.push(Wrappers[wrapperName].api[fnName])

      return Wrappers[wrapperName].api[fnName]
    }
  },

  stubWrapperInnerAPI(wrapperName, fnPath) {
     var fnPathParts = fnPath.split('.')

     return (respCB) => {
      if (!cfg.stubs.on) return emptyStub()
      if (!Wrappers[wrapperName].api) Wrappers[wrapperName].init()

       var fnName = fnPathParts.pop()
       var fnObj = Wrappers[wrapperName].api
       while (fnPathParts.length > 0) {
         var subObj = fnPathParts.shift()
         fnObj = fnObj[subObj]
       }
      sinon.stub(fnObj, fnName, respCB)

      // Hold to auto restore stub after each test
      STUB.stubs.push(fnObj[fnName])

      return fnObj[fnName]
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
