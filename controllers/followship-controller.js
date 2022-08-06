const { Followship } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      if (Number(helpers.getUser(req).id) === Number(req.body.id)) {
        req.flash('error_messages', '不能追隨自己！')
        return res.redirect(200, 'back')
      }
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      req.flash('success_messages', '追隨成功！')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: Number(helpers.getUser(req).id),
          followingId: Number(req.params.id)
        }
      })
      await followship.destroy()
      req.flash('success_messages', '取消追隨成功！')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
