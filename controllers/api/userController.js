const userService = require('../../services/userService')

const userController = {
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => res.json(data))
  },

  getTop10: (req, res) => {
    userService.getTop10((data) => res.json(data))
  }
}

module.exports = userController