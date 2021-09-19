const db = require('../../models')
const User = db.User

const helpers = require('../../_helpers')

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  getUser: async (req, res) => {
    try {
      const userId = req.params.userId
      const id = helpers.getUser(req).id
      if (userId !== id) {
        req.flash('error_messages', '只能更改自己的profile')
        res.redirect('back')
      }

      const user = await User.findByPk(id, {
        attributes: ['cover', 'avatar', 'name', 'introduction']
      })

      res.json({ user })
    } catch (err) {
      console.log(err)
    }
  },
  editUser: (req, res) => {}
}

module.exports = userController
