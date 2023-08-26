const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const moment = require('moment')
moment.locale('zh-tw')
dayjs.extend(relativeTime)
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTime: a => moment(a).fromNow()
}
