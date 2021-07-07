const moment = require('moment')

module.exports = {
  isAuth: function (auth, adminAuth, options) {
    if (auth | adminAuth) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: a => moment(a).fromNow()
}