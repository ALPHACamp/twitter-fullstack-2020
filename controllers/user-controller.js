const { } = require('../models')

const userController = {
//  add controller action here
  getUser: (req, res, next) => {
    res.render('users/tweets', {})
  }
}

module.exports = userController
