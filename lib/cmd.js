module.exports = function(commandOptions) {


  var cmd = require('commander')
    .version(require('../package.json').version)
    .allowUnknownOption()
    .usage('[options]')
    .option('-c, --config [config-file-name]', 'Instead of default "scream".json read another files')
    .option('-f, --force-seed', 'For BSON restore before running tests')
    .option('-d, --dirty-seed', 'Does not wipe existing collections on seed')
    .option('-g, --grep [regex-to-match]', 'Run only tests matching the specified regex')
    .option('-s, --specs <specs>', 'Selectively compile and run one or more comma separated spec names')
    .option('-v, --verbose', 'Verbose output mode')
    .option('-m, --muted', 'Muted output mode')
    .option('-l, --log-flag [log-flag]', 'Output a meanair.config.log flag e.g. MW_TRACE')


  for (var option of commandOptions||[])
    cmd = cmd.option(option.flag, option.help)


  return cmd.parse(process.argv)


}
