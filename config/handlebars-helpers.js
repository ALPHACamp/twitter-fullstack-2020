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
  noImage: function(a){
    return a ? a: 'https://i.imgur.com/bGxaaO6.png'
  }
}