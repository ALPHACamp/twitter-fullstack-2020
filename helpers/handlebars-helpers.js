const hbshelpers = require('handlebars-helpers')()
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

// 人性化時間顯示：ex. 16 hours age
hbshelpers.relativeTime = function (a) {
  return dayjs(a).fromNow()
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
