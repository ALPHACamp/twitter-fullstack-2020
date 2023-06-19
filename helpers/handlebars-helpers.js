const hbshelpers = require('handlebars-helpers')()
const dayjs = require('./dayjs-helper')

// 人性化時間顯示：ex. 16 hours age
hbshelpers.relativeTime = function (a) {
  return dayjs(a).fromNow()
}

// 時間格式修正：ex. 上午 10:05·2021年11月10日
hbshelpers.modifyTime = function (t) {
  return dayjs(t).format('A hh:mm・YYYY年MM月DD日')
}

// hbs 路由管理
hbshelpers.ifCond = function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this)
}

hbshelpers.substring = function (str, start, end) {
  if (str.length < 100) return str
  return str.substring(start, end) + '...'
}

module.exports = { hbshelpers }
