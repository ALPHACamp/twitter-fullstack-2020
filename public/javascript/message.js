const moment = require('moment')

function formatMessage (name, data, avatar, currentUser) {
  return {
    message: data,
    name,
    avatar,
    currentUser,
    time: moment().format('LT')
  }
}

module.exports = formatMessage
