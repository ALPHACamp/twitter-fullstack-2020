const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime')// 引入dayjs的plugin
require('dayjs/locale/zh-tw');
dayjs.locale('zh-tw');
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 為relativeTime的語法
  relativeTimeOtherType: a => dayjs(a).format('Ahh:mm．YYYY年MM月DD日'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}