const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: time => dayjs(time).locale('zh-tw').fromNow(true)
}