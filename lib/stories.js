module.exports = function({Fs, Path}, {Config}) {
  var stories = {}
  if (!Config.paths.stories) return stories

  var storyFiles = Fs.readdirSync(Config.paths.stories)
                    .filter(f => f.match(/\.js+$/) || f.match(/\.coffee+$/))
                    .map(f => f.replace(/\.js+$/,'').replace(/\.coffee+$/,''))

  for (var name of storyFiles)
    stories[name] = require(Path.join(Config.paths.stories,name))

  return stories
}
