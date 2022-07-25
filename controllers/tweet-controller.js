const assert = require('assert')
const { getUser } = require("../_helpers")
const { User, Tweet } = require('../models')

// getTweets (進到個人首頁渲染出所有資料)/ 
const tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
  },
  // postTweet: (req, res, next) => {
  //   const { description } = req.body
  //   const userId = req.user.id
  //   User.findByPk(userId)
  //     .then(user => {
  //       assert(user, "user didn't exist!")
  //       return Tweet.create({
  //         userId,
  //         description
  //       })
  //     }).then(createdTweet => {
  //       assert(createdTweet, "Failed to create tweet!")
  //       req.flash('success_messages', '發推成功！')
  //       res.redirect('back')
  //     })
  //     .catch(err => next(err))
  // }
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const userId = req.user.id
      const user = await User.findByPk(userId)
      assert(user, "user didn't exist!")
      const createdTweet = await Tweet.create({
        userId,
        description
      })
      assert(createdTweet, "Failed to create tweet!")
      req.flash('success_messages', '發推成功！')
      res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
