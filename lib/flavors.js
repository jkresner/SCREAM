// set different file in config.json if you want to
// use another assertion syntax
global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect

global.expectIdsEqual = (id1, id2) =>
  expect(id1.toString()==id2.toString(),`${id1}`.green  + " != ".grey + `${id2}`.red).to.be.true

global.expectObjIdsEqual = (obj1, obj2, idAttr) => {
  attr = idAttr || '_id'
  expect(obj1[attr],`obj1 missing attr ${attr}`.red).to.exist
  expect(obj2[attr],`obj2 missing attr ${attr}`.red).to.exist
  expect(obj1[attr].toString()==obj2[attr].toString(),`${obj1[attr]}`.green  + " != ".grey + `${obj2[attr]}`.red).to.be.true
}

global.expectContains = (str,start) =>
  expect(str.indexOf(start), start.green + " != ".grey + str.red).not.equal(-1)

global.expectStartsWith = (str,start) =>
  expect(str.indexOf(start), start.green + " != ".grey + str.red).to.equal(0)

global.expectSameDate = (d1,d2) =>
  expect(d1.utc().format().toString()).to.equal(d2.utc().format().toString())

global.expectSameMoment = (date1, date2) =>
  expect(moment(date1).isSame(moment(date2)), `${date1} ${date2}`).to.be.true

global.expectExactFields = (obj, fieldsArray, moreFields) => {
  if (moreFields && moreFields.length)
    fieldsArray = _.union(fieldsArray,moreFields)

  for (var name of fieldsArray)
    expect(_.has(obj,name), `obj missing attr [${name}]`).to.be.true

  for (var name of _.keys(obj))
    expect(_.contains(fieldsArray,name), `fieldsArray missing attr [${name}]`).to.be.true

  fieldCount = _.keys(obj).length
  expect(fieldCount==fieldsArray.length,
    `obj fields ${fieldCount}:[${_.keys(obj)}] != fieldsArray len [${fieldsArray.length}] `)
      .to.be.true
}
