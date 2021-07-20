module.exports = {
  stringLimit: function (str, limitNum) {
    if (str.length > limitNum) {
      return str.slice(0, limitNum)
    } else {
      return str
    }
  }
}