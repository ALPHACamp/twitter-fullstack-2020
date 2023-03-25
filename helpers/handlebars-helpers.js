const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 取得相對時間
  tweetCreateTime: a => dayjs(a).format('a hh:mm．YYYY[年]MM[月]DD[日]')
}