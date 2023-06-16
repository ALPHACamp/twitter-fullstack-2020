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

module.exports = dayjs
