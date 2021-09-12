const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  //貼文相關
  //顯示所有貼文
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true })
      .then(tweet => {
        return res.render('admin/tweets', { tweet: tweet })
      }) //目前可以看到全部
  },
}

module.exports = adminController