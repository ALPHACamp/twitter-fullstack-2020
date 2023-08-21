// 以下是
const ifCond = function (a, b, options) { // 檢查兩個物件是否相等，if true 回傳{{#ifconf}}中間包的東西{{/ifconf}}
  if (a === b) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
module.exports = { ifCond }
