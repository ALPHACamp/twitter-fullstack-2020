const db = require('../models')
const user = require('../models/user')
const User = db.User
const Tweet = db.Tweet
const Followership = db.Followship

const followController = {

  getfollower: (req, res) => {

    User.findAll({
      include: [
        { model: User, as: 'Followers', },
        { model: User, as: 'Followings', }
      ],
    }).then((users) => {

      const followes = req.user.Followers
      const followings = req.user.Followings

      users = users.map(user => ({
        ...user.dataValues,

        description: user.dataValues.description.substring(0, 150),
        following: req.user.Followers,  //跟隨我的人
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id), //我跟隨的人

      }))

      let following = users.filter((user) => user.id === req.user.id)

      following = following[0].following.map(user => ({
        ...following[0].following[0],
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)

      }))

      return res.render('followership', {

        users: users,
        followes: followes,
        followings: followings
      })

    })
  },
  getfollowing: (req, res) => {
    res.render('followingship')
  }
}

module.exports = followController