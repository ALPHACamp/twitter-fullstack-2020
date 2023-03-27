const { User, Tweet, reply, Followship, Like } = require('../../models')
const helpers = require('../../_helpers')
const userServices = require('../../services/user-services')
const userController = {

  addFollowing: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id)
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
      })
      if (!user) throw new Error("User doesn't exist!")
      if (!followship) {
        await Followship.create({ followerId: helpers.getUser(req).id, followingId: req.params.id })
      }
      user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers'
        }
      })

      const isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)
      res.json({
        followerCount: user.Followers.length,
        isFollowed
      })
    } catch (error) {
      console.log(error)
      res.json({
        error: error.message
      })
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id)
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
      })
      if (!user) throw new Error("User doesn't exist!")
      if (followship) await followship.destroy()
      user = await User.findByPk(req.params.id, {
        include: {
          model: User,
          as: 'Followers'
        }
      })

      const isFollowed = user.Followers.some(fr => fr.id === helpers.getUser(req).id)
      res.json({
        followerCount: user.Followers.length,
        isFollowed
      })
    } catch (error) {
      console.log(error)
      res.json({
        error: error.message
      })
    }
  },

  getLikeCount: (req, res, next) => {
    userServices.getRestaurants(req, (err, data) => err ? console.log(err) : res.json(data))
  }
}



module.exports = userController
