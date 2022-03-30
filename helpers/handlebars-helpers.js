const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  isSigninSignupPage: function (url, options) {
    return url && ['/signin', '/signup', '/admin/signin'].includes(url) ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  isAdminPage: function (url, options) {
    return url && url.includes('admin') ? options.fn(this) : options.inverse(this)
  },
  arrayLength: a => a.length
}
