const { User, Followship } = require('../models')
const { Op } = require('sequelize')

const followController = {

  getFollowers: (req, res) => {
    User.findAll({
      where: {
        is_admin: false,
        id: { [Op.ne]: req.user.id }
      },
      include: [
        { model: User, as: 'Followers', },
        { model: User, as: 'Followings' },
      ],
      order: [
        ['Followings', Followship, 'updatedAt', 'DESC']]
    }).then((users) => {

      const userId = req.user.id
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowing: req.user.Followings.map(d => d.id).includes(user.id), //我跟隨的人
        isFollowed: req.user.Followers.map(d => d.id).includes(user.id) //跟隨的我的人
      }))

      let followeringbar = users.slice(0, 10)
      followeringbar = followeringbar.sort((a, b) => b.FollowerCount - a.FollowerCount)

      users = users.filter(user => user.isFollowed === true)

      return res.render('followership', {
        users,
        userId,
        followeringbar
      })

    })
  },
  getFollowings: (req, res) => {
    User.findAll({
      where: {
        is_admin: false,
        id: { [Op.ne]: req.user.id }
      },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['Followers', Followship, 'updatedAt', 'DESC']]
    }).then((users) => {
      console.log(users)
      users = users.map(following => ({
        ...following.dataValues,
        FollowerCount: following.Followers.length,
        isFollowing: req.user.Followings.map(d => d.id).includes(following.id)
      }))

      const userId = req.user.id
      let followeringbar = users.slice(0, 10)
      followeringbar = followeringbar.sort((a, b) => b.FollowerCount - a.FollowerCount)

      users = users.filter(user => user.isFollowing === true)

      return res.render('followingship', {
        users,
        followeringbar,
        userId
      })

    })
  }
}

module.exports = followController