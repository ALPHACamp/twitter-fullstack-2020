const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  //登入頁面
  adminSignInPage: (req, res) => {
    return res.render('admin/adminsignin')
  },

  //登入
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    }).then(tweets => {
      console.log('列印出')
      console.log(tweets)
      return res.render('admin/tweets', { tweets: tweets })
    })
  }
}
module.exports = adminController
//這條程式碼不知道漏了幾次....