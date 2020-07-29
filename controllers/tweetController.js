const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    if (!helpers.getUser(req).role) {
      return Tweet.findAll({
        include: [
          User,
          Reply,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      }).then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues,
          isLiked: req.user.LikedTweets.map(d => d.id).includes(t.id)
        }))
        return res.render('tweets', { tweets: data, user: req.user })
      })
    }
    return res.render('admin/tweets', { layout: 'blank', tweets: data, user: req.user })
  },

  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '請勿空白')
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages', '超過字數140')
      return res.redirect('back')
    } else {
      return Tweet.create({
        UserId: req.user.id,
        description: req.body.description
      })
        .then(tweet => {
          res.redirect('/tweets')
        })
    }
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ],
      order: [
        [Reply, 'createdAt', 'DESC']
      ]
    })
      .then(tweet => {
        const isLiked = tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        return res.render('tweet', { tweet: tweet, isLiked: isLiked })
      })
  },
  postReply: (req, res) => {
    if (!req.body.comment) {
      req.flash('error_messages', '請勿空白')
      return res.redirect('back')
    }
    if (req.body.comment.length > 140) {
      req.flash('error_messages', '超過字數140')
      return res.redirect('back')
    } else {
      return Reply.create({
        comment: req.body.comment,
        TweetId: req.body.TweetId,
        UserId: req.user.id
      })
        .then(reply => {
          return res.redirect('back')
        })
    }
  },
  addLike: (req, res) => {
    Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    }).then((tweet) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = tweetController
