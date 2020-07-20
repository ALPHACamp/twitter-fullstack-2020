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
        { model: User, as: 'likedUser' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      res.render('tweets', { user: req.user, tweets })
    })
  }
}

module.exports = tweetController