/**                                                                     SCREAM(
* Use SCREAM.Flags to pass arguments / flags from command line which will
* be passed onto mocha (https://mochajs.org/#usage)
*
* Eg1. Use '--' to signal arguments via npm
*
*   npm test -- -g config --no-colors
*
*
* Eg2. Use node with harmony features required to run SCREAM
*
*   node test/ex1-js-emptyapp/index.js --no-colors
*
* Eg3. Use coffee with harmony features and verbose console output
*
*   coffee test/ex2-coffee/index.coffee -v
//                                                                           )*/
module.exports = function(opts) {

  delete require.cache[require.resolve('Commander')]
  var cmdline = require('Commander')
    // .version(opts.about.version)
    .allowUnknownOption()
    .usage('[options]')
    .option('-c, --config <name>', 'Use config from file [name].json')
    .option('-e, --env <name>', 'Set process.env.ENV')
    .option('-g, --grep <title>', 'Compile all specs/dependencies and run all tests with title matching [regex] ()')
    .option('-l, --log-flag <flag>', 'Output (app).config.log flag e.g. MW_TRACE')
    .option('-o, --only <name>', 'Compile and run only <spec> and its dependencies (fast)')
    .option('-s, --db-seed', 'BSON import dropping first clearing all existing data')
    .option('-S, --db-seed-dirty', 'Seed data without wiping existing data (faster)')
    .option('-q, --quiet', 'Quiet log output')
    .option('-u, --unstub', 'Execute all STUB wrapped code without faking/mocking')
    .option('-v, --verbose', 'Verbose log output')
    .parse(process.argv)

  opts.flags = assign(opts.flags||{}, cmdline)
  return opts.flags

}
