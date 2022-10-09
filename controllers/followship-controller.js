const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const id = req.params.id || req.body.id
      const loginUserId = getUser(req) && getUser(req).id

      if (id === loginUserId.toString()) {
        return res.redirect('back')
      }

      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")

      const followship = await Followship.findOne({
        where: {
          followerId: loginUserId,
          followingId: id
        }
      })
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId: loginUserId,
        followingId: id
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: getUser(req) && getUser(req).id,
          followingId: req.params.id
        }
      })
      if (!followship) throw new Error("You haven't followed this user!")
      await followship.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getFollowers: (req, res) => {
    res.render('followers')
  },
  getFollowing: (req, res) => {
    res.render('followings')
  }
}

module.exports = followshipController
