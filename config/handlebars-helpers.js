const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).fromNow()
  },



  // use helpers.getUser(req) to replace req.user
  // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()




}