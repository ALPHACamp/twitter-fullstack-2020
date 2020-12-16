const db = require('../models')
const User = db.User //input the user schema

const twitterController = {
  getTwitters: (req, res) => {
    return res.render('tweets')
  },
}

module.exports = twitterController