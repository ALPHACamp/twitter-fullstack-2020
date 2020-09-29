const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminController