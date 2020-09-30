const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: User
    })
      .then(tweets => {
        return res.render('admin/tweets', { tweets })
      })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(tweet => {
            return res.redirect('back')
          })
      })
  },


}

module.exports = adminController