module.exports = function(customOptions) {

  var cmd = require('commander')
    .version(require('../package.json').version)
    .usage('[options]')
    .option('-c, --config [config-file-name]', 'Instead of default "scream".json read another files')
    .option('-v, --verbose', 'Output verbose error detail')
    .option('-m, --muted', 'Output no application logging')
    .option('-f, --force-seed', 'For BSON restore before running tests')
    .option('-d, --dirty-seed', 'Does not wipe existing collections on seed')
    .option('-s, --specs <specs>', 'Selectively compile and run one or more comma separated spec names')


  for (var option of customOptions||[])
    cmd = cmd.option(option.flag, option.help)

  return cmd.parse(process.argv)

}