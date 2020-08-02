const moment = require('moment')

module.exports = {
  formatMessage (name, data) {
    return {
      message: data,
      name: socket.id,
      time: moment().format('LT')
    }
  }
}