const moment = require('moment')

module.exports = {
  isAuth: function (auth, adminAuth, options) {
    if (auth | adminAuth) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: time => moment(time).fromNow(),
  momentTimeStamp: time => {
    moment.locale('zh-tw')
    return moment(time).format('a hh:mm · LL')
  }
}