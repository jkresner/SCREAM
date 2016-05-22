module.exports = function(commandOptions) {


  var cmd = require('commander')
    .allowUnknownOption()
    .usage('[options]')
    .option('-v, --verbose', 'Verbose output')
    .option('-t, --terse', 'Terse output')
    .option('-h, --help', 'Help mode')
    .option('-c, --config [name]', 'Load config from file [name].json')
    .option('-g, --grep [title]', 'Compile all specs/dependencies and run all tests with title matching [regex] ()')
    .option('-o, --only [name]', 'Compile and run only <spec> and its dependencies (fast)')
    .option('-s, --seed', 'BSON import/restore (drops existing collections)')
    .option('-d, --dirty', 'Seed data without wiping existing collections (faster)')
    // .option('-l, --log-flag [log-flag]', 'Output a meanair.config.log flag e.g. MW_TRACE')


  for (var option of commandOptions||[])
    cmd = cmd.option(option.flag, option.help)


  return cmd.parse(process.argv)


}
