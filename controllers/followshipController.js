const helpers = require('../_helpers')
const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const followshipController = {
  addFollow: async (req, res) => {
    try {
      const followerId = Number(helpers.getUser(req).id)  // 這是 number，怕忘記，統一再一次 Number()
      const followingId = Number(req.body.id)  // 這是 string

      if (followerId === followingId) {
        req.flash('error_messages', '不可跟隨自己')
        return res.redirect('back')
      }

      await Followship.findOrCreate({ where: { followerId, followingId } })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = followshipController
