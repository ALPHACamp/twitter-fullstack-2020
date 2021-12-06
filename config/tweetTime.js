module.exports = {
  time: (datetime) => {
    const time = datetime.toLocaleTimeString()
    return time
  },

  date: (datetime) => {
    const date = datetime.getFullYear() + '年' + datetime.getMonth() + '月'+ datetime.getDate() + '日'
    return date
  }
}