const db = require('../models')
const { User, Like, Tweet, Reply } = db
const helpers = require('../_helpers')

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
  },

  getTwitter: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, { include: [{ model: Like }, { model: Reply, include: [User] }, User] })
      .then((tweet) => {
        tweetLiked = tweet.Likes.filter(like => like.likeOrNot === true).length
        tweetDisliked = tweet.Likes.filter(like => like.likeOrNot === false).length
        res.render('tweet', { tweet: tweet.toJSON(), tweetLiked, tweetDisliked })
      }).catch(err => console.log(err))
  },

  postReply: (req, res) => {
    const tweetId = req.params.id
    const comment = req.body.comment
    if (!comment) {
      req.flash('error_messages', '內容不能為空白')
      return res.redirect('back')
    }
    return Reply.create({
      TweetId: tweetId,
      UserId: helpers.getUser(req).id,
      comment: req.body.comment
    }).then(reply => {
      res.redirect('back')
    })
  }
}

module.exports = twitterController
