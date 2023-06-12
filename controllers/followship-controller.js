// files
const { Followship, User } = require('../models')
const helpers = require('../_helpers')

// controllers
const followshipController = {
  addFollowing: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const followingId = req.body.id

    if (userId.toString() === followingId.toString()) {
      return res.status(200).json({ error: "You can't follow yourself." })
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
    const userId = helpers.getUser(req).id
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
  },
  getTopFollowedUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        req.userData = {
          ...result
        }
        res.send(req.userData) // 測試用
      })
      .catch(err => next(err))
  }
}

// exports
module.exports = followshipController
