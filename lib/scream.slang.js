global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect


//chaijs.com/api/plugins

var cstring = '<string>'.cyan
var cbson = '<BSONID>'.cyan
var pretty = fn =>
  (arg1, arg2, assert, val) =>
    'expect'.green+'('.gray+`${arg1}`+').'.gray+`${fn}`.green+'('.gray+`${arg2}`+')'.gray+'\n\n  expects '+`${assert}`+' got '+`${val}`.cyan + `\n\n    DESCRIBE "${DESC}" > IT "${TEST.title}"`.white


chai.Assertion.addChainableMethod('inc', function(patterns) {
  var pret = pretty('inc')
  var input = this.__flags.object

  var patternswd = `"${patterns||''}"`.white.dim
  this.assert(!!input && input.constructor == String, pret(cstring, patternswd, cstring, `<${typeof input}${input===''?':empty':''}>`+` ${input||''}`.white.dim))
  var inputcd = ('"'+(input||"")+'"').split('\n').map(ln=>ln.white.dim).join('\n')
  this.assert(!!patterns, pret(inputcd, cstring, cstring, `${typeof patterns}`))

  var type = patterns.constructor
  if (type == String || type == RegExp || !patterns.length)
    patterns = [patterns]

  for (var p of patterns) {
    type = p.constructor
    if (type == RegExp)
      this.assert(p.test(input), pret(inputcd, `${p}`.cyan, 'RegExp.match == true'.green, 'false'))
    else if (type == String)
      this.assert(input.indexOf(p) != -1, pret(inputcd, `${p}`.cyan, 'String.indexOf > -1'.green, '-1'))
    else
      this.assert(false, pret(inputcd, cstring, cstring, `<${typeof p}> `+ `${p}`.dim))
  }
})


chai.Assertion.addChainableMethod('starts', function(str) {
  var input = this.__flags.object
  this.assert(input != null, `expect(<string>).starts() requires String to chain expect.starts but got null`)
  this.assert(input.constructor == String, `expect(<string>).starts() requires String to chain expect.starts but got ${input.constructor} for ${input}`)
  this.assert(str.constructor == String, `expect.starts(<string>).starts() requires String arg to compare to ${input}`)

  var idx = input.indexOf(str)
  if (idx == 0) return
  var at = `\n\n AT expect ${'input'.gray} starts[${str.white}] \n\ninput`
  if (idx == -1)
    this.assert(false, `${at}[${input.gray}]\n\n`).to.be.true
  if (idx > 0)
    this.assert(false, `${at}found at ${idx} of[${input.replace(str,str.yellow).gray}]\n*\n*`).to.be.true
})


chai.Assertion.addChainableMethod('bsonId', function() {
  var pret = pretty('bsonId')
  var input = this.__flags.object
  this.assert(!!input, pret(cbson, '', 'ObjectId', typeof input))
  var mongoId = input instanceof ObjectId
  var mongooseId = `${input}`.length == 24 && input.constructor != String
  this.assert(mongoId || mongooseId, pret(cbson, '', cbson, `<${typeof input.constructor}>`.cyan +' for '+ `${input}`.cyan.dim))
})


chai.Assertion.addChainableMethod('bsonIdStr', function() {
  var input = this.__flags.object
  this.assert(input != null, `expect(<BSONID>).bsonIdStr() requires String to chain expect.bsonIdStr but got null`)
  this.assert(input.constructor == String && input.length == 24, `expect(<string>).bsonIdStr() expects string of 24 char in length for ${input}`)
  this.assert(/[0123456789abcdefg]*/.test(input), `expect(<string>).bsonIdStr() expects only characters [0123456789abcdefg] for ${input}`)
})


chai.Assertion.addChainableMethod('attr', function(attr, constructor) {
  var input = this.__flags.object
  this.assert(input != null, `expect(<Object>).attr but got null`)
  this.assert(input.constructor == Object, `expect(<Object>).attr but got constructor ${input.constructor} for ${input}`)
  this.assert(input[attr], attr.white+" missing on: "+JSON.stringify(input))
  if (constructor)
    this.assert(input[attr].constructor == constructor, `${attr}.constuctor #{input[attr].constructor.name.cyan} but expecting ${constructor.name.cyan} on: ${JSON.stringify(input)}`)
})


chai.Assertion.addChainableMethod('eqId', function(o2) {
  var o1 = this.__flags.object
  var id1 = o1._id || o1
  var id2 = o2._id || o2
  this.assert(id1 != null ,`expect(<id>).eqId() expects an id, but got null`.red)
  this.assert(id2 != null, `expect().eqId(<id>) expects an id, but got null`.red)
  this.assert(id1.toString()==id2.toString(),`expect(${id1}).eqId(${id2}) are not equal`.red)
})


chai.Assertion.addChainableMethod('eqDate', function(d2) {
  var d1 = this.__flags.object
  this.assert(d1 != null ,`expect(<date>).eqDate() expects a date, but got null`.red)
  this.assert(d2 != null, `expect().eqDate(<date>) expects a date, but got null`.red)
  this.assert(d1.utc().format().toString()==d2.utc().format().toString(),`expect(${d1}).eqDate(${d2}) are not equal`.red)
})


// module.exports.equalMoments = (d1, d2) =>
//   expect(moment(d1).isSame(moment(d2)), `${d1} ${d2}`).to.be.true


chai.Assertion.addChainableMethod('attrs', function(attrs) {
  // module.exports.attrs = (obj, fieldsArray, moreFields) => {
  // if (moreFields && moreFields.length) {
  //   for (var field of moreFields)
  //     if (fieldsArray.indexOf(fields) == -1) fieldsArray.push(field)
  // }
  this.assert(attrs != null, `expect().attrs(<string>) expects a space delimited string, but got null`.red)
  var array = attrs
  if (attrs.constructor == String)
    array = attrs.split(' ')
  var obj = this.__flags.object
  this.assert(obj != null ,`expect(<object>).attrs() expects an object, but got null`.red)
  for (var attr of array)
    this.assert(obj.hasOwnProperty(attr), `obj missing attr ${attr.white}`.red)
  for (var attr in obj)
    this.assert(array.indexOf(attr) > -1, `extra attr ${attr.white} on obj[${attrs}]`.red)
})

