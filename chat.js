const moment = require('moment')

module.exports = {
  formatMessage (name, data, avatar, currentUser) {
    return {
      message: data,
      name,
      avatar,
      currentUser,
      time: moment().format('LT')
    }
  }
}