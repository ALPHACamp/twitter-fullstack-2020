const userServices = require('../services/user-services')
const apiController = {
  renderEditPage: (req, res) => {
    userServices.renderEditPage(req, res, (data) => {
      return res.status(200).json(data)
    })
  }

}
module.exports = apiController
