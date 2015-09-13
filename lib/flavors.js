// set different file in config.json if you want to
// use another assertion syntax
global.sinon                 = require('sinon')
global.chai                  = require('chai')
global.expect                = chai.expect

global.expectIdsEqual = (id1, id2) =>
  expect(id1.toString()===id2.toString(),`${id1} != ${id2}`.magenta).to.be.true

global.expectContains = (str,start) =>
  expect(str.indexOf(start), `${start} ${str}`).not.equal(-1)

global.expectStartsWith = (str,start) =>
  expect(str.indexOf(start), start.magenta + " != " + str.white).to.equal(0)

global.expectSameDate = (d1,d2) =>
  expect(d1.utc().format().toString()).to.equal(d2.utc().format().toString())

global.expectSameMoment = (date1, date2) =>
  expect(moment(date1).isSame(moment(date2)), `${date1} ${date2}`).to.be.true

