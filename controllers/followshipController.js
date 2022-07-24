const { Followship } = require('../models')
//passport.js 要增加 
  //include: [
  //  { model: User, as: 'Followers' },
  //  { model: User, as: 'Followings' }
  //]
const followshipController = {
  addFollowing: async (req, res) => {
    try {
      if (req.user.id === parseInt(req.body.id))
        return req.flash('error_messages', '自己不能追隨自己！')
      await Followship.create({
        followerId: req.user.id,
        followingId: req.body.id
      })
      req.flash('error_messages', '追隨成功！')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.body.id,
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
