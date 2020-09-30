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
          isLiked: helpers.getUser(req).LikedUsers.map(d => d.id).includes(t.id)
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
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweet => {
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      return res.render('tweet', {
        tweet: tweet.toJSON(), 
        isLiked:isLiked 
      })
    })
    .catch(error => console.log(error))
  },

  postTweet: (req,res) => {
    if (!req.body.description){
      // req.flash('error_message', '留言不得為空')
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      // req.flash('error_message', '貼文不得超過140個字')
      return res.redirect('/')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(tweet => {
      return res.redirect('/')
    })
    .catch(error => console.log(error))
  },

  addLike: (req, res) => {
    return Like.create({
      UserId:helpers.getUser(req).id, 
      TweetId: req.params.tweetId
    }).then((tweet) => {
      return res.redirect('back') 
    })
    .catch(error => console.log(error))
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id, 
        TweetId: req.params.tweetId
      }
    }).then((like) => {
      like.destroy().then((tweet) => {
        return res.redirect('back')
      })
    })
    .catch(error => console.log(error))
  }




  


}

module.exports = tweetController

