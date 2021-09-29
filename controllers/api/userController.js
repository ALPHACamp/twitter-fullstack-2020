const userService = require('../../services/userService.js')

let userController = {

  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, data => {
      return res.status(200).json(data)
    })
  },

  renderUserProfileEdit: (req, res) => {
    userService.renderUserProfileEdit(req, res, data => {
      return res.status(200).json(data)
    })
  },

  putUserProfileEdit: (req, res) => {
    userService.putUserProfileEdit(req, res, data => {
      return res.status(200).json(data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.status(200).json(data)
    })
  }
}

module.exports = userController
