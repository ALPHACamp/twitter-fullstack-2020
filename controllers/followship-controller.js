const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followerId = (helpers.getUser(req) && helpers.getUser(req).id) || []
    const followingId = Number(req.params.userId)
    if (followerId === followingId) throw new Error('Not allow to follow yourself!')
    return Promise.all([
      User.findByPk(followerId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You already followed this user!')
        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(createdFollowship => res.redirect('back'))
      .catch(next)
  },
  removeFollowing: (req, res, next) => {
    const followerId = (helpers.getUser(req) && helpers.getUser(req).id) || []
    const followingId = req.params.userId
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You didn't follow this user!")
        return followship.destroy()
      })
      .then(deletedFollowship => res.redirect('back'))
      .catch(next)
  }
}

module.exports = followshipController
