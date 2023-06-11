const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime).locale('zh-tw')

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow().slice(0, -1),
  normalTimeForm: a => dayjs(a).format('YYYY年MM月DD日'),
  ifCond: (a, b, options) => {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifFalseAndEqual: (a, b, c, options) => {
    return a && b !== c ? options.fn(this) : options.inverse(this)
  },
  ifFalseAndNotEqual: (a, b, c, options) => {
    return !a && b !== c ? options.fn(this) : options.inverse(this)
  },
}