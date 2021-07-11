const { User } = require('../models')


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
      where: { is_admin: false },
      include: [
        {
          model: User,
          as: 'Followings',
        }
      ],
    }).then((users) => {

      const id = req.user.id
      users = users.map(user => ({
        ...user.dataValues,
        isFollowing: req.user.Followings.map(d => d.id).includes(user.id)
      }))

      users = users.filter(user => user.isFollowing === true)

      return res.render('followingship', {
        users: users,
        id: id
      })

    })
  }
}

module.exports = followController