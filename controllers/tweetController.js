const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getTweets: (req, res) => {
    console.log(req.user)
    return res.render('tweets')
  }
}

module.exports = tweetController