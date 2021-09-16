const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          Reply,
          User,
          Like
        ],
        order: [['createdAt', 'DESC']]
      })
      console.log('get tweets:', tweets[1].dataValues.User.name)
      const reorganizationTweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        userAvatar: tweet.User.avatar,
        replyLength: tweet.Replies.length
      }))
      console.log('mapping tweet:', reorganizationTweets)
      return res.render('tweets', { reorganizationTweets })
    } catch(err) {
      console.warn(err)
    }
  }, 
  addTweet: async (req, res) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })
      return res.redirect('/tweets')
    } catch(err) {
      console.warn(err)
    }   
  },
  getTweet: (req, res) => {

  }, 
  postReplies: (req, res) => {

  },
  addLike: (req, res) => {

  }, 
  removeLike: (req, res) =>{

  }
}

module.exports = tweetController