const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const userService = require('../services/userService')

const apiController = {
  getUser: async (req, res) => {
    try {
      const { userId } = req.params
      if (Number(userId) === helpers.getUser(req).id) {
        const user = await User.findByPk(userId, { attributes: ['id', 'cover', 'avatar', 'name', 'introduction'] })
        return res.json(user.toJSON())
      } else {
        return res.json({ status: 'error' })
      }
    } catch (err) {
      return res.json({ status: 'error', message: err })
    }
  },
 postUser: (req, res) => {
   userService.putProfileEdit(req, res, data => {
     return res.status(200).json(data).redirect(`/users/${data.userId}`)
   })
 }
}

module.exports = apiController