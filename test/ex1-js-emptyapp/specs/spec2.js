module.exports = function() {

  IT('expect(false).to.be.false', function() {
    expect(false).to.be.false
    expect(false).false
    DONE()
  })

}
