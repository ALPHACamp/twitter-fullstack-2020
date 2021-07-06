const { options } = require("../app")

module.exports = {
  isAuth: function(auth, adminAuth, options) {
    if (auth | adminAuth) {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}