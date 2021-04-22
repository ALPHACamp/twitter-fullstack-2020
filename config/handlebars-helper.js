const moment = require('moment')

module.exports = {
  isEqual: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  }
}