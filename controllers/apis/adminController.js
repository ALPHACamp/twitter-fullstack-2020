

const adminService = require('../../services/adminService')

const adminController = {



  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },


}

module.exports = adminController