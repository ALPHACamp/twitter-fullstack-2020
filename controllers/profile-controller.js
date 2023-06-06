const profileController = {
  getUserTweets: (req, res) => {
    res.render('users/profile')
  },
  getUserFollows: (req, res) => {
    res.render('users/follow')
  },
  editUser: (req, res) => {
    res.render('users/edit')
  }
}

module.exports = profileController
