const moment = require('moment')

module.exports = {
  // 人性化 datetime helper
  moment: (datetime) => moment(datetime).fromNow(),

  // 後面可以加別的 hbs helper

}