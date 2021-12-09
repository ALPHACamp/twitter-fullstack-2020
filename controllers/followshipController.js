const helpers = require('../_helpers')
const db = require('../models')
const { Followship } = db

const followshipController = {
  addFollow: async (req, res) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)

      if (followerId === followingId) {
        req.flash('error_messages', '不可跟隨自己')
        return res.redirect(200, 'back')
      }

      await Followship.findOrCreate({ where: { followerId, followingId } })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeFollow: async (req, res) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.userId)

      await Followship.destroy({ where: { followerId, followingId } })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = followshipController
