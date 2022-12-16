function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user
}

const dayjs = require('dayjs')
const relativetime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativetime)

module.exports = {
  ensureAuthenticated,
  getUser,
  relativetimeFromNNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
