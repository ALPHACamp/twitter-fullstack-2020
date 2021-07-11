const { User, Followship } = require('../models')
const Sequelize = require('Sequelize')

const followController = {

  // getFollowing: async (req, res, next) => {
  //   try {
  //     const [result] = await Promise.all([
  //       User.findAll({
  //         raw: true,
  //         nest: true,
  //         order: [['createdAt', 'DESC']],
  //         include: [
  //           {
  //             model: User,
  //             as: 'Followers',
  //             attributes: ['img', 'id']
  //           },
  //           {
  //             model: User,
  //             as: 'Followings',
  //             attributes: ['img', 'id']
  //           }
  //         ]
  //       })])
  //     const id = req.user.id
  //     const data = result.rows.map(user => ({
  //       ...user,
  //       isFollowing: user.Followings.map(d => d.id).includes(user.id),
  //       isFollowed: user.Followers.map(d => d.id).includes(user.id)
  //     }))

  //     const users = data.filter(user => user.isFollowed === true)
  //     return res.render('followership', {
  //       users: users,
  //       id: id
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // },
  getFollowing: (req, res) => {
    User.findAll({

      include: [
        {
          model: User,
          as: 'Followers',
          as: 'Followings',
        }
      ],
    }).then((users) => {
      // console.log(users)
      const id = req.user.id

      users = users.map(user => ({
        ...user.dataValues,
        isFollowing: req.user.Followings.map(d => d.id).includes(user.id), //我跟隨的人
        isFollowed: req.user.Followers.map(d => d.id).includes(user.id) //跟隨的我的人
      })).sort((a, b) => b.isFollowed.createdAt - a.isFollowed.createdAt)
        .slice(0, 10)

      users = users.filter(user => user.isFollowed === true)
      let Users = users.toJSON()
      console.log(`Users: ${Users}`)
      return res.render('followership', {
        users: users,
        id: id
      })

    })
  },
  getFollower: (req, res) => {
    return User.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [
        User
        // { model: User, as: 'Followings'}
      ]
    }).then((users) => {
      Followship.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Followship]
      }).then(followers => {
        return res.render('followingship', {
          users,
          followers
        })
      })
    })
  }
}

module.exports = followController
