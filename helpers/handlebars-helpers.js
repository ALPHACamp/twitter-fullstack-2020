const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')
require('dayjs/locale/zh-tw')
// const { options } = require('../routes')
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).locale('zh-tw').fromNow(true),
  localizedFormat: a => {
    let data = String(dayjs(a).format('A h:mm‧YYYY年M月DD日'))
    data.includes('P') ? data = data.replace('PM', '下午') : data = data.replace('AM', '上午')
    return data
  },
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}
