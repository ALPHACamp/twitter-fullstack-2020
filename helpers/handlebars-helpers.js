const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  checkBanner: banner => banner || '/images/user-defaultBanner.png',
  checkAvatar: avatar => avatar || '/images/user-defaultAvatar.png',
  isAdmin: userRole => userRole === 'admin'
}
