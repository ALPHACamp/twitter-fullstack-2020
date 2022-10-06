const { Tweet } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      order: [
        ['created_at', 'DESC']
      ]
    })
      .then(tweets => res.render('tweets', { tweets }))
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (description.trim() === '') {
      req.flash('error_messages', 'Tweet 內容不能為空')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', 'Tweet ')
      return res.redirect('back')
    }
    Tweet.create({ description })
      .then(() => {
        req.flash('success_messages', '成功推文')
        return res.redirect('tweets')
      })
  }
}

module.exports = tweetController
