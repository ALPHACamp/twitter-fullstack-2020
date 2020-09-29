const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({include: [User, Reply, 
      {model: User, as: 'LikedUsers'}],
      order: [['createdAt', 'DESC']]
      })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues, 
          description: t.dataValues.description, 
          isLiked: req.user.LikedUsers.map(d => d.id).includes(t.id)
        }))
        return res.render('tweets', {tweets: data})
      })
    .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include:[
        {model: Reply, include:[User]}, 
        {model: User, as: 'LikedUsers'}
      ]
    }).then(tweet => {
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.render('tweet', 
      tweet: tweet.toJSON(), 
      isLiked:isLiked )
    })
  }

  


}

module.exports = tweetController

