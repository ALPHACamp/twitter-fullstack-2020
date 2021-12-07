const helpers = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db

const followshipController = {
  addFollow: async (req, res) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.userId)

      if (followerId === followingId) {
        req.flash('error_messages', '不可跟隨自己')
        return res.end()
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
