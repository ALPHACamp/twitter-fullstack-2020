const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifCondNot: function (a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  },
  momentFormat: function (a) {
    return moment(a).format('YYYY年MM月DD日, hh:mm')
  },
  noImage: function (a) {
    return a ? a : 'https://i.imgur.com/bGxaaO6.png'
  },
  constainsAdmin: function (a) {
    const word = 'admin'
    return a.includes(word)
  },
  renderFollower: function (a) {
    const word = 'follower'
    return a.includes(word)
  }
}