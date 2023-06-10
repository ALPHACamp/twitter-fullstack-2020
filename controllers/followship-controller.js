const { User, Followship} = require('../models')
const _helpers = require('../_helpers')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followerId = _helpers.getUser(req).id
      const followingId = req.body.id
      
      const [ followship, followingUser ] = await Promise.all([
        Followship.findOne({
          where: { 
            followerId, 
            followingId,
          }
        }),
        User.findOne({
          where: { id: followingId }
        })
      ])
     
      if (!followingUser) throw new Error("User didn't exist!")

      if (followship) throw new Error("You are already following this user!")

      if (parseInt(followingId) === followerId) {
        req.flash('error_messages', '不能追隨自己！')
        return res.redirect(200, 'back')
      }

      await Followship.create({
        followerId, 
        followingId
      })
      req.flash('success_messages', '追隨成功！')
      return res.redirect('back')

    } catch(err) {
      next(err)
    }
  },
  unfollowUser: async (req, res, next) => {
    try {
      const followerId = _helpers.getUser(req).id
      const followingId = req.params.uid
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
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