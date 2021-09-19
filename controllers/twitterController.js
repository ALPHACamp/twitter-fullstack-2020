const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    Tweet.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    }).then(tweets => {
      const tweetData = tweets.rows.map(row => ({
        ...row.dataValues,
        tweetUserAvatar: row.User.dataValues.avatar,
        tweetUserName: row.User.dataValues.name,
        tweetUserAccount: row.User.dataValues.account,
        tweetContent: row.content,
        tweetRepliesCount: row.Replies.length,
        tweetLikesCount: row.Likes.length,
      }))
      return res.render('twitter', {
        tweets: tweetData
      })
    })
  }
}

module.exports = twitterController