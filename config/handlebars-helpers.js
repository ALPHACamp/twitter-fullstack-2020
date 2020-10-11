const moment = require('moment')

module.exports = {
  isAdmin: function(isAdmin, options){
    if(isAdmin){
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).fromNow()
  }
}