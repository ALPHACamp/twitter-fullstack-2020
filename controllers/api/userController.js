const userService = require('../../services/userService')
const helpers = require('../../_helpers')
const userController = {
  getUser: (req, res) => {
    console.log(helpers.getUser(req).id.toString())
    console.log()
    if (helpers.getUser(req).id.toString() === req.params.id){
      userService.getUser(req, res, (data) => res.json(data))
    }else{
      return res.json({status:'error'})
    }

  },

  getTop10: (req, res) => {
    userService.getTop10((data) => res.json(data))
  },

  putProfile: (req, res) => {
    userService.putProfile(req, res, (data) => {
      return res.render('users',data)
    })
  }
}

module.exports = userController