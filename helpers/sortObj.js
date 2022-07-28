const sortObj = property => {
  return function (obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value2 - value1
  }
}

module.exports = sortObj