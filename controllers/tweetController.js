const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const tweetController = {
  //顯示所有貼文(要改api)
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true })
      .then(tweet => {
        return res.render('index', { tweet: tweet })
      })
  },
  //新增一則貼文
  createTweets: (req, res) => {
    return res.render('create')
  },
  postTweets: (req, res) => {
    if (!req.body.tweet) {
      req.flash('error_messages', "請輸入貼文內容")
      return res.redirect('back')
    }
    return Tweet.create({
      // userId: ,
      description: req.body.tweet
    })
      .then((tweet) => {
        req.flash('success_messages', 'tweet was successfully created')
        res.redirect('/')
      })
  },

  //顯示特定貼文
  // getTweet: (req, res) => {

  // },
  //回覆特定貼文
  // createTweetReplies: (req, res) => {

  // },
  //顯示特定貼文回覆
  // getTweetReplies: (req, res) => {

  // },
  //喜歡特定貼文
  // addLike: (req, res) => {

  // },
  //取消喜歡特定貼文
  // removeLike: (req, res) => {

  // }
}

module.exports = tweetController