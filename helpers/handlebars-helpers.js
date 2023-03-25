const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') 
dayjs.extend(relativeTime) 

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 取得相對時間
  }