const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
