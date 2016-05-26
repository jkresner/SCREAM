module.exports = function({Fs, Path}) {

  var {stories,codeExt} = OPTS.config.paths

  var names = Fs.readdirSync(stories)
    .filter(f => f.match(codeExt))
    .map(f => f.replace(codeExt,''))


  var story = {}
  for (var name of names)
    story[name] = require(Path.join(stories, name))

  OPTS.log.setup('STORY', names.join(' '))

  return story

}
