const { User } = require('../models')
const helpers = require('../_helpers')
const tweetServices = {
  getFollowing: (req, cb) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }],
      limit: 10,
      order: [['createdAt', 'DESC']]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        const filterSelfUser = []
        users = users.forEach(user => {
          if (user.id !== helpers.getUser(req).id && user.role !== 'admin') {
            filterSelfUser.push(user)
          }
        })
        users = filterSelfUser.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
        return cb(null, { users: users })
      })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
