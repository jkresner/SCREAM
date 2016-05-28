var Obj = {

  get(obj, path) {
    var parts = path.split('.')
    if (parts.length == 1)
      return obj[path]

    var top = parts.shift()
    if (!obj[top]) return
    return Obj.get(obj[top], path.replace(top+'.',''))
  },

  set(obj, path, val) {
    var parts = path.split('.')
    if (parts.length == 1)
      obj[path] = val
    else {
      var top = parts.shift()
      obj[top] = Obj.set(obj[top]||{}, parts.join('.'), val)
    }
    return obj
  },

  unset(obj, path) {
    'use strict';

    var parts = path.split('.')
    if (parts.length == 1)
      delete obj[path]
    else {
      var top = parts.shift()
      obj[top] = Obj.unset(obj[top]||{}, parts.join('.'))
    }
    return obj
  },

  copyAttrs(obj, attrs) {
    var copy = {}
    for (var attr in obj) {
      if (attrs.indexOf(attr) != -1) {
        var val = obj[attr]
        if (val && val.constructor === Array) {
          copy[attr] = []
          for (var item of val) {
            if (item.constructor === Object)
              copy[attr].push(Obj.copyAttrs(item, Object.keys(item)))
            else
              copy[attr].push(item)
          }
        }
        else if (val && val.constructor === Object)
          copy[attr] = Obj.copyAttrs(obj[attr], Object.keys(obj[attr]))
        else
          copy[attr] = val
      }
    }
    return copy
  },

  deepFreeze(obj) {
    'use strict';

    // $log('deepFreeze', !obj || !obj.constructor ? 'null constructor' : obj.constructor.toString())
    if (!obj || !obj.constructor) return obj
    if (obj.constructor === Array) return obj.map(o => Obj.deepFreeze(o))
    if (obj.constructor === Object) {
      for (var attr in obj)
        Obj.deepFreeze(obj[attr])
      // $log('freezing', obj)
      Object.freeze(obj)
    }

    return obj
  }

}


var App = {

  empty() {
    var args = [].slice.call(arguments)
    var last = args.pop()
    var done = () => {}
    if (last.constructor == Function) done = last
    else if ((last||{}).done && last.done.constructor == Function) done = last.done
    setTimeout(done, 100)
    return {}
  }

}


module.exports = {Obj,App}
