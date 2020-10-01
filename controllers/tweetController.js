const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [Like, User, Reply]
      //where: { UserId: req.user.id },      
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
         ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes.length,
        repliesCount: tweet.dataValues.Replies.length,
        user: tweet.dataValues.User.dataValues,
      }))
      //console.log(tweets)
      return res.render('tweets', { tweets })
    })  
  },

  postTweets: (req, res) => {
    const { description } = req.body
    Tweet.create({
      description,
      UserId: req.user.id
    })
    .then(tweet => {
      
    })
  }
}

module.exports = tweetController