
var util = {
  get(obj, path) {
    var parts = path.split('.')
    if (parts.length == 1)
      return obj[path]

    var top = parts.shift()
    if (!obj[top]) return
    return util.get(obj[top], path.replace(top+'.',''))
  },
  set(obj, path, val) {
    var parts = path.split('.')
    if (parts.length == 1)
      obj[path] = val
    else {
      var top = parts.shift()
      obj[top] = util.set(obj[top]||{}, parts.join('.'), val)
    }
    return obj
  }
}

module.exports = util
