const moment = require('moment')

module.exports = {
  moment: function(time) {
    return moment(time).fromNow()
  }
}