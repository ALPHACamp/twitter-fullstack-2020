const hbshelpers = require('handlebars-helpers')()
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const updateLocale = require('dayjs/plugin/updateLocale')
const twLocale = require('dayjs/locale/zh-tw')
// 使用擴充
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

// 設定使用 zh-tw 設定檔
dayjs.locale(twLocale)

// 更新 zh-tw 設定檔
dayjs.updateLocale('zh-tw', {
  // 更改相關時間的寫法，記得要改就要全部改，不能只改幾個
  relativeTime: {
    future: '%s內',
    past: '%s',
    s: '幾秒前',
    m: '1 分鐘',
    mm: '%d 分鐘',
    h: '1 小時',
    hh: '%d 小時',
    d: '1 天',
    dd: '%d 天',
    M: '1 個月',
    MM: '%d 個月',
    y: '1 年',
    yy: '%d 年'
  },
  // 更改 12小時制 上下午判斷的名稱
  meridiem: (hour, minute, isLowercase) => {
    return hour >= 12 ? '下午' : '上午'
  }
})

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
