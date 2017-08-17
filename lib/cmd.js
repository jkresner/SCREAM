module.exports = function(commandOptions) {


  var cmd = require('commander')
    .allowUnknownOption()
    .usage('[options]')
    .option('-c, --config <name>', 'Load config from file [name].json')
    .option('-d, --dirty', 'Seed data without wiping existing collections (faster)')
    .option('-e, --env <name>', 'Set process.env.ENV')
    .option('-g, --grep <title>', 'Compile all specs/dependencies and run all tests with title matching [regex] ()')
    .option('-h, --help', 'Help mode')
    .option('-l, --log-flag [flag]', 'Output (app).config.log flag e.g. MW_TRACE')
    .option('-o, --only <name>', 'Compile and run only <spec> and its dependencies (fast)')
    .option('-s, --seed', 'BSON import/restore (drops existing collections)')
    .option('-q, --quiet', 'Quiet log output')
    .option('-v, --verbose', 'Verbose log output')


  for (var option of commandOptions||[])
    cmd = cmd.option(option.flag, option.help)


  return cmd.parse(process.argv)


}
