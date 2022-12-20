const helpers = require('../_helpers')
const { Followship, Like, Reply, Tweet, User } = require('../models')
const followshipController = {
  postFollowships: (req, res, next) => {
    const followingId = Number(req.body.id)
    if (helpers.getUser(req).id === followingId) throw new Error('Cannot follow yourself!')
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user || user?.role === 'admin') throw new Error("User doesn't exist!")
        if (followship) throw new Error('You have already followed this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: followingId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  deleteFollowships: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.id
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

module.exports = followshipController
