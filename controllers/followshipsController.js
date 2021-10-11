const db = require('../models')
const Followship = db.Followship
const Op = db.Sequelize.Op
const helpers = require('../_helpers')

const followshipsController = {
  follow: async (req, res) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)
    try {
      if (followerId !== followingId) {
        await Followship.create({
            followerId,
            followingId,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return res.status(200).redirect('back')
      } else {
        req.flash('error_messages', '不可跟隨自己')
        return res.redirect('back')
      }
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  unfollow: async (req, res) => {
    const followingId = Number(req.params.id)
    const followerId = Number(helpers.getUser(req).id)
    try {
      const unfollow = await Followship.findOne({ where: { 
        [Op.and]: [
          { followingId: { [Op.eq]: followingId } },
          { followerId: { [Op.eq]: followerId } }
        ] }
      })
      if (unfollow) {
        await Followship.destroy({
          where: {
            [Op.and]: [
              { followingId: { [Op.eq]: followingId } },
              { followerId: { [Op.eq]: followerId } },
            ]
          }
        })
        return res.status(200).redirect('back')
      } else {
        req.flash('error_messages', '操作失敗')
        return res.redirect('back')
      }
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = followshipsController