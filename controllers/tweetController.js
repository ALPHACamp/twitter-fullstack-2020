const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [Reply, { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']],
    }).then(tweets => {
      const data = tweets.map(data => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        Replies: data.Replies.sort((a, b) => b.createdAt - a.createdAt),
        LikedUsers: data.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt)
      }))

      return res.json({ data })
    })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User]}
      ]
    }).then(tweet => {
      const ReplyCount = tweet.Replies.length
      const LikedCount = tweet.LikedUsers.length
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)
      LikedUsers = tweet.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt)
      return res.json({ tweet, ReplyCount, LikedCount })
    })
  }
}
module.exports = tweetController