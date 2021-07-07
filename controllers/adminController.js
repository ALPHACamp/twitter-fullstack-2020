const db = require('../models')
const Tweet = db.Tweet

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true })
      .then(tweets => {
        return res.render('admin/tweets', { tweets: tweets })
      })
  },
  createTweet: (req, res) => {
    return res.render('admin/create')
  },
  postTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: req.user.id,
      content: req.body.content,
      likes: req.body.likes
    })
      .then((tweet) => {
        req.flash('success_messages', 'Tweet was successfully created')
        res.redirect('/admin/tweets')
      })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      raw: true
    }).then(tweet => {
      return res.render('admin/tweet', {
        tweet: tweet
      })
    })
  }
}

module.exports = adminController
