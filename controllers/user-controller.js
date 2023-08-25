const { } = require('../models')

const userController = {
//  add controller action here
  getUser: (req, res, next) => {
    res.render('users/tweets', {})
  },
  getUserLikes: (req, res, next) => {
    res.render('users/likes', {})
  },
  getUserReplies: (req, res, next) => {
    res.render('users/replies', {})
  }
}

module.exports = userController
