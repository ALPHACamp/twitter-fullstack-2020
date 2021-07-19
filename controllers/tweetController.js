const { Tweet, User, Reply } = require('../models')

const tweetService = require('../services/tweetService')

const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.render('tweets', data)
    })
  },
  getTweet: async (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.render('tweet', data)
    })
  },
  postTweet: (req, res) => {
    tweetService.postTweet(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/tweets')
    })
  },
  postReply: (req, res) => {
    tweetService.postReply(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('back')
    })
  }
}

module.exports = tweetController