const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  getAdminTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    }).then(tweets => {
      console.log(tweets)
      return res.render('admin/tweets', { tweets })
    })
  }
}
module.exports = adminController