const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  getAdminTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      return res.render('admin/tweets', { tweets })
    })
  },

  deleteAdminTweet: (req, res) => {
    return Tweet.findOne({
      where: {
        id: req.params.tweetId
      }
    }).then(tweet => {
      tweet.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
    })
  }
}
module.exports = adminController