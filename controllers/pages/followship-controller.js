/* test檔案 followship 是 自己一個route@@ */
const { Followship, User } = require('../../models')
const { FollowshipError } = require('../../helpers/errors-helpers')
const helpers = require('../../_helpers')
const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id // 我追蹤別人
      const followingId = parseInt(req.body.id)// 我要追蹤的人
      console.log('followerId:', followerId)
      console.log('followingId:', followingId)
      if (followerId === followingId) {
        return res.redirect(200, 'back')
        // throw new FollowshipError('Don\'t follow yourself!')
      }// 不要追蹤自己
      const [user, followship] = await Promise.all([
        User.findByPk(followingId), // 我要follow的人在不在
        Followship.findOne({
          where: {
            followerId,
            followingId
          }
        })
      ])

      if (!user) throw new FollowshipError("User you want to follow didn't exist!")
      if (followship) throw new FollowshipError('You have already followed this user!')
      await Followship.create({
        followerId,
        followingId
      })
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id // 我追蹤別人
      const followingId = req.params.id // 我要追蹤的人
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
      if (!followship) throw new FollowshipError('You have not followed this user!')
      await followship.destroy()
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}
module.exports = followshipController
