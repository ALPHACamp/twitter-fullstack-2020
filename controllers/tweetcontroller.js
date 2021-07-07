const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    console.log(req.user.role)
    res.render('tweets')
  }
}

module.exports = tweetController
