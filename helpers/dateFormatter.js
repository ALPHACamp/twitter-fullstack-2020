const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const updateLocale = require('dayjs/plugin/updateLocale')
require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

module.exports = (data, timezone) => {
  
  const fromNow = dayjs(data.createdAt).locale('zh-tw').fromNow()
  data.createdAt.setHours(data.createdAt.getHours() + timezone)
  const hours = data.createdAt.getHours()
  const minutes = data.createdAt.getMinutes();
  const year = data.createdAt.getFullYear();
  const month = data.createdAt.getMonth() + 1;
  const day = data.createdAt.getDate()

  const meridiem = hours < 12 ? '上午' : '下午';
  const hour12 = hours % 12 || 12; // convert to 12-hour format


  data.createdAt = {

    part: meridiem,
    year: year,
    month: month,
    day: day,
    hour: pad(hour12),
    minute: pad(minutes),
    fromNow: fromNow
  }

}
// Pad a number with leading zeros to a specified length


function pad(num) {
  return num.toString().padStart(2, '0');
}
