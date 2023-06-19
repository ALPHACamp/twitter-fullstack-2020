const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const utc = require('dayjs/plugin/utc')

dayjs.extend(relativeTime)
dayjs.extend(utc)

dayjs.locale('zh-tw')

module.exports = {
  currentYear: () => dayjs().utcOffset(480).year(),
  relativeTimeFromNow: a => dayjs(a).utcOffset(480).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  tweetCreateTime: a => dayjs(a).utcOffset(480).format('a hh:mm．YYYY[年]MM[月]DD[日]')
}
