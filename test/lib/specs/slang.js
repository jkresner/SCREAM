module.exports = () => {

before(function() {
  global.DESC = ''
  global.TEST = { title: 'slang spec' }
  global.OPTS.log = require('../../../lib/log')({config:{
    colors: { spec: 'white', error: 'red' },
    log: { quiet: true, filter_fail: '' } }
  })
  require('../../../lib/scream.slang')
})

describe("expect().inc()", function() {

  it('Throw expect(undefined).inc(<string>)', () =>
    expect(()=>expect().inc('ddd')).to.throw(Error, 'undefined'))

  it('Throw expect(<number>).inc(<string>)', () =>
    expect(()=>expect(222).to.inc("22")).to.throw(Error, 'number'))

  it('Throw expect(<string>).inc(undefined)', () =>
    expect(()=>expect('ddd').inc()).to.throw(Error, 'undefined'))

  it('Throw expect(<string>).inc(<number>)', () =>
    expect(()=>expect('ddd').inc(11)).to.throw(Error, 'number'))

  it('Throw expect(<string>).inc(<regExp>) false match', () =>
    expect(()=>expect('ddd').inc(/sdf/i)).to.throw(Error, 'false'))

  it('Pass expect(<string>).inc(<regExp>) match', () =>
    expect('SDF').inc(/sdf/i))

  it('Pass expect(<string>).inc([<regExp>]) all match', () =>
    expect('SDF').inc([/sd/i,/DF/]))

  it('Throw expect(<string>).inc([<regExp>]) one false match', () =>
    expect(()=>expect('ddd').inc([/dd/i,/f/i])).to.throw(Error, 'false'))

  it('Throw expect(<string>).inc([<regExp>,<number>])', () =>
    expect(()=>expect('dF').inc([/df/i,22])).to.throw(Error, 'number'))

})


it.skip("expect().attr()")
it.skip("expect().attrs()")
it.skip("expect().bsonId()")
it.skip("expect().bsonIdStr()")
it.skip("expect().eqId()")
it.skip("expect().eqDate()")
it.skip("expect().starts()")


}
