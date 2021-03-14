const moment = require('moment')

function message (username, text) {
  return ({
    username,
    text,
    time: moment().format('h:mm a')
  })
}

module.exports = message
