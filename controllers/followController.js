const db = require('../models')
const user = require('../models/user')
const User = db.User
const Tweet = db.Tweet
const Followship = db.Followship
const Sequelize = require('Sequelize')
const followController = {

  getfollowing: (req, res) => {

    User.findAll({
      include: [
        {
          model: User,
          as: 'Followers',
        }
      ],
    }).then((users) => {

      users = users.map(user => ({
        ...user.dataValues,

        isFollowed: req.user.Followers.map(d => d.id).includes(user.id)
      }))
      users = users.filter(user => req.user.id !== user.id)
      console.log(users)

      return res.render('followership', {
        users: users
      })

    })
  },
  getfollower: (req, res) => {
    User.findAll({
      include: [
        {
          model: User,
          as: 'Followings',
        }
      ],
    }).then((users) => {

      users = users.map(user => ({
        ...user.dataValues,

        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.filter(user => user.isFollowed === true)
      console.log(users)

      return res.render('followingship', {
        users: users
      })

    })
  }
}

module.exports = followController