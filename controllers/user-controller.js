const userController = {
  getUserTweets: (req, res) => {
    res.render('users/profile')
  },
  getUserFollows: (req, res) => {
    res.render('users/follow')
  }
}

module.exports = userController
