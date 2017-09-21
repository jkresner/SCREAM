module.exports = function() {

  IT('expect(true).to.be.true', function() {
    expect(true).to.be.true
    expect(true).true
    DONE()
  })

}
