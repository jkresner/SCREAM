module.exports = function({Fs, Path}) {

  let {paths,setup} = OPTS.config
  let {ext} = OPTS.config.setup

  var names = Fs.readdirSync(paths.stories)
    .filter(f => f.match(setup.ext))
    .map(f => f.replace(setup.ext,''))


  var story = {}
  for (var name of names)
    story[name] = require(join(paths.stories, name))

  OPTS.log.info('STORY', names.join(' '))

  return story

}
