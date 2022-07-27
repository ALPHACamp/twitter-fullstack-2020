const { Followship } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      if (helpers.getUser(req).id === Number(req.body.id)) {
        req.flash('error_messages', '自己不能追隨自己！')
        return res.redirect(200, 'back')
      }
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      req.flash('error_messages', '追隨成功！')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    //post 可以 delete不行
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.followingId
        }
      })
      await followship.destroy()
      req.flash('error_messages', '取消追隨成功！')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
