const { User, sequelize } = require('../models')
const { Followship } = require('../models')
const { models } = require('Sequelize')
const { Sequelize } = require('Sequelize')


const followController = {

  getFollowing: (req, res) => {
    User.findAll({
      include: [
        {
          model: User,
          as: 'Followers',
          as: 'Followings',
        },
      ],
    }).then((users) => {

      const id = req.user.id

      users = users.map(user => ({
        ...user.dataValues,
        isFollowing: req.user.Followings.map(d => d.id).includes(user.id), //我跟隨的人
        isFollowed: req.user.Followers.map(d => d.id).includes(user.id) //跟隨的我的人
      }))

      users = users.filter(user => user.isFollowed === true)
      return res.render('followership', {
        users: users,
        id: id
      })

    })
  },
  getFollower: (req, res) => {
    User.findAll({
      where: { id: req.user.id },
      include: [
        {
          model: User,
          as: 'Followings',
        }
      ],
      raw: true,
      nest: true,
    }).then((users) => {

      const id = req.user.id
      users = users.map(user => ({
        ...user.Followings.Followship,
        createdAt: user.createdAt
      }))
      // users = users.map(user => ({
      //   ...user.dataValues,
      //   isFollowing: req.user.Followings.map(d => d.id).includes(user.id)
      // }))


      users = users.sort((a, b) => {
        return bgetTime() - a.getTime()
      })
      console.log(users)


      // users = users.filter(user => user.isFollowing === true)

      return res.render('followingship', {
        users: users,
        id: id
      })

    })
  }
}

module.exports = followController