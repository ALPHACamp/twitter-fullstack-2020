const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipsController = {
  addFollowing: (req, res, next) => {
    Promise.all([
      User.findByPk(helpers.getUser(req).id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (parseInt(helpers.getUser(req).id) === parseInt(req.body.id)) {
          return res.redirect(200, 'back')
        }
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
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
module.exports = followshipsController
