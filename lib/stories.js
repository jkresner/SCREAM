module.exports = function({Fs, Path}, opts) {

  var stories = {}
  var cfg = opts.config.paths.stories
  if (!cfg) return stories

  var storyFiles = Fs.readdirSync(cfg)
                    .filter(f => f.match(/\.js+$/) || f.match(/\.coffee+$/))
                    .map(f => f.replace(/\.js+$/,'').replace(/\.coffee+$/,''))

  for (var name of storyFiles)
    stories[name] = require(Path.join(cfg,name))

  return stories
}
