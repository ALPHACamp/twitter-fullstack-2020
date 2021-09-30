const userService = require('../../services/userService.js')

const userController = {

  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  renderUserEdit: (req, res) => {
    userService.renderUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  putUserEdit: (req, res) => {
    userService.putUserEdit(req, res, (data) => {
      return res.status(200).json(data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.status(200).json(data)
    })
  },
  
}

module.exports = userController