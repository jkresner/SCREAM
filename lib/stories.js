module.exports = function({Fs, Path}, cfg) {
  var stories = {}
  if (!cfg.paths.stories) return stories

  var storyFiles = Fs.readdirSync(cfg.paths.stories)
                    .filter(f => f.match(/\.js+$/) || f.match(/\.coffee+$/))
                    .map(f => f.replace(/\.js+$/,'').replace(/\.coffee+$/,''))

  for (var name of storyFiles)
    stories[name] = require(Path.join(cfg.paths.stories,name))

  return stories
}
