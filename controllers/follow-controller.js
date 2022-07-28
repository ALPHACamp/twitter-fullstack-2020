const assert = require('assert')
const helpers = require("../_helpers")
const { User, Followship } = require('../models')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const follower = await User.findByPk(helpers.getUser(req).id)
      const following = await User.findByPk(Number(req.body.id))
      assert(following, `user didn't exist!`)
      if (follower.id === following.id) return res.redirect(200, 'back')
      const newFollow = await Followship.findOrCreate({
        where: {
          followerId: follower.id,
          followingId: following.id
        }
      })
      const isFollowing = newFollow[1]
      assert(isFollowing, '你已經追蹤人家了啦~♥')
      // 更新追隨、追蹤人數
      await follower.update({
        followingCounts: follower.followingCounts += 1
      })
      await following.update({
        followerCounts: following.followerCounts += 1
      })
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const follower = await User.findByPk(helpers.getUser(req).id)
      const following = await User.findByPk(Number(req.params.id))
      assert(following, `user didn't exist!`)
      const isFollowing = await Followship.findOne({
        where: {
          followerId: follower.id,
          followingId: following.id
        }
      })
      assert(isFollowing, '你已經取消追蹤囉')
      const removedFollow = await isFollowing.destroy()
      // 更新追隨、追蹤人數
      await follower.update({
        followingCounts: follower.followingCounts -= 1
      })
      await following.update({
        followerCounts: following.followerCounts -= 1
      })
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  getTopFollowers: async (req, res, next) => {
    try {
      const follower = helpers.getUser(req)
      const followerList = await Followship.findAll({
        where: {
          followerId: follower.id
        },
        raw: true
      })
      const topFollowerUsers = await User.findAll({
        order: [
          ['followerCounts', 'DESC'],
          ['id', 'ASC']
        ],
        limit: 10,
        raw: true
      })
      return res.json({ followerList, topFollowerUsers })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = followController
