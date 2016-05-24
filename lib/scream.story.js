module.exports = function({Fs, Path}, opts) {

  var stories = {}
  var cfg = opts.config.paths.stories
  if (!cfg) return stories

  Fs.readdirSync(cfg)
    .filter(f => f.match(/\.(js|coffee)$/))
    .map(f => f.replace(/\.(js|coffee)$/,''))
    .forEach(name => stories[name] = require(Path.join(cfg, name)) )

  return stories

}
