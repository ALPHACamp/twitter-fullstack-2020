const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        { model: User, as: 'likedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      res.render('tweets', { user: req.user, tweets })
    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.redirect('/')
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description,
    }).then(tweet => {
      return res.redirect('/')
    })
  }
}

module.exports = tweetController