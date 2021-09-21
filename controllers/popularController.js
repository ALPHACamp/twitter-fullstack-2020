const db = require('../models')
const User = db.User

const helpers = require('../_helpers')

const popularController = {
  getPopular: async (req, res, cb) => {
    try {
      const userself = req.user
      const users = await User.findAll({
        where: { role: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      popularUsers = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id) 
      }))

      helpers.removeUser(popularUsers, userself.id) 
      popularUsers = popularUsers.sort(
        (a, b) => b.FollowerCount - a.FollowerCount
      )

      cb( popularUsers )

    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = popularController
