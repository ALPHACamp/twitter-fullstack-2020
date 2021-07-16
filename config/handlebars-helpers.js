const moment = require('moment')

module.exports = {
  //...
  moment: function (a) {
    return moment(a).fromNow()
  },
  ifCond: function (a, options) {
    if (a === true) {
      console.log(this)
      return options.fn(this)
    }
    return options.inverse(this)
  }
}