const moment = require('moment')
moment.locale('zh-tw', {
  longDateFormat: {
    L: 'M月D日'
  }
})

module.exports = {
  //...
  moment: function (a) {
    const b = new Date()
    const dateFromNow = (b - a) / (1000 * 60 * 60 * 24)
    if (dateFromNow < 2 ){
      return moment(a).fromNow()
    } else {
      return moment(a).format('L')
    }
  },
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  whoAreYou: function(a, options){
    if (a === "user") {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}
