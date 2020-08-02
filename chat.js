const moment = require('moment')

module.exports = {
  formatMessage (name, data) {
    return {
      message: data,
      name: name,
      time: moment().format('LT')
    }
  }
}