const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [Reply],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      return res.render('tweets', { tweets: tweets })
    })
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
        { model: Reply, include: [User] }
      ],
      order: [
        [Reply, 'createdAt', 'DESC']
      ]
    })
      .then(tweet => {
        return res.render('tweet', { tweet: tweet })
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
  }
}

module.exports = tweetController
