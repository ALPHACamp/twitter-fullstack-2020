const db = require('../models')
const User = db.User //input the user schema
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    return res.render('tweets')
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
  },

}

module.exports = twitterController