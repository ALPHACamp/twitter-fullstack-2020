const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const Tweet = db.Tweet

const tweetController = {

  getTweets: (req, res) => {
    res.render('tweets')
  }

}

module.exports = tweetController