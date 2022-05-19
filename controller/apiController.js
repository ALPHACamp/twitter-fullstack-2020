const { User } = require('../models')
const helpers = require('../_helpers')
const axios = require('axios')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const apiController = {
  editUser: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req) && helpers.getUser(req).id
      const userData = await User.findOne({
        where: {
          id: loginUserId,
          isAdmin: false
        },
        attributes: [
          'id',
          'name',
          'avatar',
          'cover',
          'account',
          'introduction'
        ]
      })
      const result = {
        'id': userData.id,
        'name': userData.name,
        'avatar': userData.avatar,
        'cover': userData.cover,
        'account': userData.account,
        'introduction': userData.introduction
      }
      console.log('result', result)
      res.json({ status: 'success', result })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = apiController
