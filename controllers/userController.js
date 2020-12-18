const db = require('../models')
const User = db.User

const helper = require('../_helpers')


module.exports = {
  getFollowings: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'Followings',
        through: {
          attributes: ['createdAt']
        }
      }]
    })
      .then(user => {
        // console.log(user.dataValues.Followings)
        // console.log(user.toJSON().Followings[0].Followship)
        // console.log(user.dataValues.Followings[0])
        const currentUser = helper.getUser(req)
        const followings = user.dataValues.Followings.map(f => ({
          ...f.dataValues,
          introduction: f.introduction.substring(0, 150),
          isFollowed: currentUser.Followings.map(v => v.id).includes(f.id)
        }))

        res.render('followings', {
          user: user.toJSON(),
          currentUser,
          followings
        })
      })
  },

  getFollowers: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'Followers',
        through: {
          attributes: ['createdAt']
        }
      }]
    })
      .then(user => {
        const currentUser = helper.getUser(req)
        const followers = user.dataValues.Followers.map(f => ({
          ...f.dataValues,
          introduction: f.introduction.substring(0, 150),
          isFollowed: currentUser.Followings.map(v => v.id).includes(f.id)
        }))

        res.render('followers', {
          user: user.toJSON(),
          currentUser,
          followers
        })
      })
  }
}