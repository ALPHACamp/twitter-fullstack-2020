const { User } = require('../models')

const userController = {
  getUserSetting: (req, res, next) => {
    return res.render('user-setting')
  },
  getUserFollowings: (req, res, next) => {
    return res.render('followings')
  },
  getUserFollowers: (req, res, next) => {
    return res.render('followers')
  }
}


module.exports = userController 