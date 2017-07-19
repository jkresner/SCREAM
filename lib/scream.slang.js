global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect


var jk = `\n\n FAIL `.red.dim + `${'expect('.magenta}`

// http://chaijs.com/api/plugins/

chai.Assertion.addChainableMethod('inc', function(patterns) {
  var prefix = (type) =>`${jk}${'<string>'.gray}${')inc('.magenta}${'<string>'.yellow}${(') match:['+type+']').magenta}\n\n`

  var input = this.__flags.object

  this.assert(input !== undefined, `${prefix()} requires <string> but got'.magenta} ${'undefined'.white}\n\ninput[`)
  this.assert(input.constructor == String, `expect(<string>) requires String to chain expect.inc but got ${input.constructor} for #{input}`)

  var type = patterns.constructor

  if (type == String || type == RegExp || !patterns.length) patterns = [patterns]

  for (var p of patterns) {
    type = p.constructor

    if (type == RegExp) {
      if (!p.test(input))
        this.assert(false, prefix('RegExp')+`${p}\n${p.constructor}\n`.white + input.split('\n').map(ln=>ln.gray).join('\n'))
    }
    else if (type == String) {
      if (input.indexOf(p) == -1)
        this.assert(false, prefix('String')+`${p}\n\n`.white + input.split('\n').map(ln=>ln.gray).join('\n'))
    }
    else
      this.assert(false, `${prefix()} requires <string> but got'.magenta} ${'undefined'.white}`)
  }
})

chai.Assertion.addChainableMethod('starts', function(str) {
  var input = this.__flags.object
  this.assert(input != null, `expect(<string>) requires String to chain expect.starts but got null`)
  this.assert(input.constructor == String, `expect(<string>) requires String to chain expect.starts but got ${input.constructor} for ${input}`)
  this.assert(str.constructor == String, `expect.starts(<string>) requires String arg to compare to ${input}`)

  var idx = input.indexOf(str)
  if (idx == 0) return
  var at = `\n\n AT expect ${'input'.gray} starts[${str.white}] \n\ninput`
  if (idx == -1)
    this.assert(false, `${at}[${input.gray}]\n\n`).to.be.true
  if (idx > 0)
    this.assert(false, `${at}found at ${idx} of[${input.replace(str,str.yellow).gray}]\n*\n*`).to.be.true
})


chai.Assertion.addChainableMethod('bsonId', function() {
  var input = this.__flags.object
  this.assert(input != null, `expect(<BSONID>).bsonId() requires ObjectID to chain expect.bsonId but got null`)
  var mongoId = input instanceof ObjectId
  var mongooseId = `${input}`.length == 24 && input.constructor != String
  this.assert(mongoId || mongooseId, `expect(<BSONID>).bsonId() but got constructor <${typeof input.constructor}> for ${input}`)
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


module.exports.equalIds = (id1, id2) =>
  // expect(id1.toString()==id2.toString(), `${id1}`.green  + " != ".grey + `${id2}`.red).to.be.true
  expect(`${id1}`, "\n  id1:".gray+`${id1}`.green+" != ".grey+'id2:'.gray+`${id2}\n\n`.red).to.equal(`${id2}`)


module.exports.equalIdAttrs = (obj1, obj2, idAttr) => {
  attr = idAttr || '_id'
  expect(obj1[attr],`obj1 missing attr ${attr}`.red).to.exist
  expect(obj2[attr],`obj2 missing attr ${attr}`.red).to.exist
  expect(obj1[attr].toString()==obj2[attr].toString(),`${obj1[attr]}`.green  + " != ".grey + `${obj2[attr]}`.red).to.be.true
}


module.exports.equalDates = (d1,d2) =>
  expect(d1.utc().format().toString()).to.equal(d2.utc().format().toString())


module.exports.equalMoments = (d1, d2) =>
  expect(moment(d1).isSame(moment(d2)), `${d1} ${d2}`).to.be.true


module.exports.attrs = (obj, fieldsArray, moreFields) => {
  if (fieldsArray.constructor == String)
    fieldsArray = fieldsArray.split(' ')

  if (moreFields && moreFields.length) {
    for (var field of moreFields)
      if (fieldsArray.indexOf(fields) == -1) fieldsArray.push(field)
  }

  for (var name of fieldsArray)
    expect(obj.hasOwnProperty(name), `obj missing attr ${name.white}`).to.be.true

  for (var name in obj)
    expect(fieldsArray.indexOf(name)!=-1, `extra attr ${name.white} on` + JSON.stringify(obj).gray).to.be.true

  var keys = Object.keys(obj)
  fieldCount = keys.length
  expect(fieldCount==fieldsArray.length,
    `obj fields ${fieldCount}:[${keys}] != fieldsArray len [${fieldsArray.length}] `)
      .to.be.true
}
