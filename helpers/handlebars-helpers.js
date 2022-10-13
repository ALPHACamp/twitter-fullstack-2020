const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },

  normalTimeForm: a => dayjs(a).format('YYYY/MM/DD-A h:m'),

  ifCondFalse: function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this)
  },

  relativeTimeFromNow: a => dayjs(a).fromNow()
}
