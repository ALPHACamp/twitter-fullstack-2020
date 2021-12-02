const helpers = require('../_helpers')
const db = require('../models')
const User = db.User

const userService = {
  getTopUser: (req, res, cb) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }], where: { role: 'user' } }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length
        //isFollowed: req.user.Followings.map(item => item.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)

      cb(users)
    })
  }
}

module.exports = userService