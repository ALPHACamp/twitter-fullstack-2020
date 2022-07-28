const assert = require('assert')
const helpers = require("../_helpers")
const sortObj = require('../helpers/sortObj')
const { User, Followship } = require('../models')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const followingId = Number(req.body.id)
      const followerId = helpers.getUser(req).id
      if (followingId === followerId) return res.redirect(200, 'back')
      const newFollow = await Followship.findOrCreate({
        where: {
          followerId,
          followingId
        }
      })
      const isFollowing = newFollow[1]
      assert(isFollowing, '你已經追蹤人家了啦~♥')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const followerId = helpers.getUser(req).id
      const following = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
      assert(!following, '你已經取消追蹤囉')
      const removedFollow = await following.destroy()
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  getTopFollowers: async (req, res, next) => {
    try {
      const followingUserId = await Followship.findAll({
        where: { followerId: helpers.getUser(req).id },
        raw: true
      })
      const topFollower = await Followship.findAndCountAll({
        group: 'following_id',
        raw: true,
        nest: true
      })
      // const topFollower = await User.findAll({
      //   limit: 10,
      //   raw: true,
      //   nest: true
      // })
      const users = []
      for (let i in topFollower.rows) {
        const user = await User.findByPk(topFollower.rows[i].followingId, { raw: true })
        user.followerCounts = topFollower?.count[i].count
        users.push(user)
        users.sort(sortObj('followerCounts'))
      }
      res.json({ followingUserId, users })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = followController
