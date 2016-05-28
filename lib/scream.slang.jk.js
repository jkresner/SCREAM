global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect


// http://chaijs.com/api/plugins/

chai.Assertion.addChainableMethod('inc', function(patterns) {
  var input = this.__flags.object
  if (patterns.constructor != Array) patterns = [patterns]
  for (var pattern of patterns) {
    if (!input.match(RegExp(pattern)))
      this.assert(false, `${pattern.white} expected in:\n
`                       + input.split('\n').map(ln=>ln.gray).join('\n'))

  }
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
