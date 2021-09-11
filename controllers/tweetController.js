const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const tweetController = {
  //顯示所有貼文(要改api)
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true })
      .then(tweet => {
        console.log(tweet)
        return res.render('index', { tweet: tweet })
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