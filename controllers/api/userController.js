const userService = require('../../services/userService')
const helpers = require('../../_helpers')
const userController = {
  getUser: (req, res) => {
    if (helpers.getUser(req).id !== req.params.id) {
      return res.redirect('back')
    }else{
      userService.getUser(req, res, (data) => res.json(data))
    }
  },

  getTop10: (req, res) => {
    userService.getTop10((data) => res.json(data))
  }
}

module.exports = userController