const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {

    return res.render('twitter', {
      tweets: tweets,
      User: users
    })
  }
}

module.exports = twitterController