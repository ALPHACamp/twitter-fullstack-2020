const userService = require('../../service/user-services')

const apiController = {
  getUserEditPage: async (req, res, next) => {
    userService.getUserEditPage(req, (err, user) => err
      ? next(err)
      : res.json({ ...user }))
  },
  postUserInfo: async (req, res, next) => {
    await userService.postUserInfo(req, (err, data) => err
      ? next(err)
      : res.json(data))
  }
}

module.exports = apiController
