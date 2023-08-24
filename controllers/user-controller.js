const userController = {
  getUserSetting: (req, res, next) => {
    return res.render('user-setting')
  },
  getUserFollowings: (req, res, next) => {
    return res.render('following')
  }
}


module.exports = userController 