const { User, Tweet, Reply, Like, Followship } = require('../models')

const { imgurFileHandler } = require('../_helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('signup', { users })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
