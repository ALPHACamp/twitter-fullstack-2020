const { User } = require('../models')
const { Op } = require('sequelize')

const followController = {

  getFollowers: (req, res) => {
    User.findAll({
      where: { is_admin: false, id: { [Op.ne]: req.user.id } },
      include: [
        { model: User, as: 'Followers', },
        { model: User, as: 'Followings' },
      ],

    }).then((users) => {

      const id = req.user.id
      users = users.map(user => ({
        ...user.dataValues,

        isFollowing: req.user.Followings.map(d => d.id).includes(user.id), //我跟隨的人
        isFollowed: req.user.Followers.map(d => d.id).includes(user.id) //跟隨的我的人
      }))

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      let followeringbar = users.slice(0, 10)


      users = users.filter(user => user.isFollowed === true)
      return res.render('followership', {
        users: users,
        id: id,
        followeringbar
      })

    })
  },
  getFollowings: (req, res) => {
    User.findAll({
      where: {
        is_admin: false, id: { [Op.ne]: req.user.id }
      },
      include: [{ model: User, as: 'Followings' },
      { model: User, as: 'Followers' }],
      order: [
        [{ model: User, as: 'Followings', }, 'createdAt', 'DESC']
      ]
    }).then((users) => {

      const id = req.user.id
      users = users.map(following => ({
        ...following.dataValues,
        FollowerCount: following.Followers.length,
        isFollowed: req.user.Followings.some(d => d.id === following.id),
        isFollowing: req.user.Followings.map(d => d.id).includes(following.id)
      }))

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

      let followeringbar = users.slice(0, 10)

      users = users.filter(user => user.isFollowing === true)

      return res.render('followingship', {
        users: users,
        followeringbar,
        id: id
      })

    })
  }
}

module.exports = followController