OPTS.log.setup('DATA', '.')

global.ISODate = str => moment(str).toDate()

if (global.DB)
  global.ID = global.ObjectId = DB.ObjectId

module.exports = {
  timeSeed: prfx => (prfx||'')+moment().format('X')
}
