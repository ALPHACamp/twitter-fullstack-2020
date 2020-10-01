const db = require('../models')
const User = db.User

const adminControllers = {

  getTweets: (req, res) => {

    return res.render('admin/tweets')
  }
}

module.exports = adminControllers