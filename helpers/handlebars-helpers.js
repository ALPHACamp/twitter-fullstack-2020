const dayjs = require('dayjs') // 載入 dayjs 套件

// 載入dayjs的relativeTime plugin
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 把絕對時間轉換成相對描述
  time: a => {
    const hour = dayjs(a).format('HH')
    if (hour > 12) return dayjs(a).format('下午 hh:mm．YYYY年MM月DD日')
    return dayjs(a).format('上午hh:mm．YYYY年MM月DD日')
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
