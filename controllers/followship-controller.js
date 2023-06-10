// files
const { Followship, User } = require('../models')

// controllers
const followshipController = {
  addFollowing: (req, res, next) => {
    const userId = req.user.id
    const followingId = req.params.userId

    if (userId.toString() === followingId.toString()) {
      return next(new Error('can not follow self'))
    }

    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: userId,
          followingId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const userId = req.user.id
    const followingId = req.params.userId
    return Followship.findOne({
      where: {
        followerId: userId,
        followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

// exports
module.exports = followshipController
