const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
      return res.render('tweetsHome')
    },
    getTweet: async (req, res) => {
      const id = req.params.id
      const tweet = await Tweet.findOne({
        where: { id },
        include: [
          User, 
          {model: Reply, include: [User]}
        ]
      })

      const totalLike = await Like.count({
        where: { UserId: id }
      })
      const totalComment = tweet.toJSON().Replies.length

      const totalCount = {
        totalLike, totalComment
      }

      console.log(totalLike, totalComment)
      res.render('tweet',{ tweet: tweet.toJSON(), totalCount })
    }
  }
  module.exports = tweetController