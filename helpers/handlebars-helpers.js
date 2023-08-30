const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

require('dayjs/locale/zh-tw')
dayjs.extend(relativeTime)

const currentYear = () => {
  return dayjs().year()
}

const relativeTimeFromNow = time => {
  return dayjs(time).fromNow()
}

const detailTime = time => {
  return dayjs(time).format('A hh:mm・YYYY年MM月DD日')
}
const ifCond = function (a, b, options) { // 檢查兩個物件是否相等，if true 回傳{{#ifconf}}中間包的東西{{/ifconf}}
  if (a === b) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
const getRepliesTweetUser = context => {
  if (context && context.User) {
    return context.User.account
  }
  console.log(context)
  return 'sad'
}
module.exports = {
  currentYear,
  relativeTimeFromNow,
  detailTime,
  ifCond,
  getRepliesTweetUser
}
