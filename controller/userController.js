const userController = {
  getUserTweets: (req, res) => {
    res.render('user/tweets')
  }
}
module.exports = userController