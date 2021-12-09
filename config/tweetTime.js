module.exports = {
  time: (datetime) => {
    return datetime.toLocaleTimeString()
  },

  date: (datetime) => {
    return (
      datetime.getFullYear() +
      '年' +
      datetime.getMonth() +
      '月' +
      datetime.getDate() +
      '日'
    )
  }
}
