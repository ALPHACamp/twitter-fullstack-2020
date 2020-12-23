const db = require('../models')
const User = db.User // input the user schema
const Like = db.Like
const Tweet = db.Tweet

const twitterController = {
  getTwitters: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      // console.log('tweets result', tweets)
      tweets = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      return res.status(200).render('tweets', { tweets: tweets })
    }
    )
      .catch(error => {
        console.log(error)
        res.sendStatus(400)
      })
  },
  createTwitters: (req, res, next) => {
    console.log(req)
  },

  postTwitters_thumbs_up: (req, res) => {
    tweetId = req.params.id
    userId = req.user.id
    Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    }).then(like => {
      if (like) {
        like.update({
          likeOrNot: true
        })
          .then((like) => {
            return res.redirect('back')
          })
      } else {
        Like.create({
          UserId: userId,
          TweetId: tweetId,
          likeOrNot: true
        })
          .then((like) => {
            return res.redirect('back')
          })
      }
    })
  },

  postTwitters_thumbs_down: (req, res) => {
    tweetId = req.params.id
    userId = req.user.id
    Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    }).then(like => {
      if (like) {
        like.update({
          likeOrNot: false
        })
          .then((like) => {
            return res.redirect('back')
          })
      } else {
        Like.create({
          UserId: userId,
          TweetId: tweetId,
          likeOrNot: false
        })
          .then((like) => {
            return res.redirect('back')
          })
      }
    })
  }

}

module.exports = twitterController
