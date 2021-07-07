const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const adminController = {
  getTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User]
      })
    ]).then(([tweets]) => {
      return res.render('admin/tweets', {
        tweets: tweets
      })
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
      include: [User]
    })
      .then((tweet) => {
        console.log(`tweet:${tweet}`)
        return res.render('admin/tweet', {
          tweet: tweet.toJSON()
        })
      })
  },
  editTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, { raw: true }).then(tweet => {
      return res.render('admin/create', { tweet: tweet })
    })
  },
  putTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }

    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        Tweet.update({
          UserId: req.user.id,
          content: req.body.content,
          likes: req.body.likes
        })
          .then((tweet) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/tweets')
          })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            res.redirect('/admin/tweets')
          })
      })
  }
}

module.exports = adminController
