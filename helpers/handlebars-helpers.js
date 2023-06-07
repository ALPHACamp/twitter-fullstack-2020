const hbshelpers = require('handlebars-helpers')()
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

// 人性化時間顯示：ex. 16 hours age
hbshelpers.relativeTime = function (a) {
  return dayjs(a).fromNow()
}

module.exports = { hbshelpers }
