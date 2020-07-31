const moment = require('moment')
moment.locale('zh-tw', {
  longDateFormat: {
    L: 'M月D日',
    LL: 'A h點mm分・YYYY年M月D日'
  },
  meridiem: function (hour, minute) {
    const hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  }
})

module.exports = {
  getTime: function(a) {
    a = moment(a).local()
    return moment(a).format('LL')
  },
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
