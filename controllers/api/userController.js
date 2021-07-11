const userService = require('../../services/userService')

const userController = {
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController