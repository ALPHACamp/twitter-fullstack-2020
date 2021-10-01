const db = require('./models')
const User = db.User

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function getUsers(req) {
  if (ensureAuthenticated(req)) {
    return new Promise((resolve, reject) => {
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
        resolve(users)
      })
    })
  }
}


module.exports = {
  ensureAuthenticated,
  getUser,
  getUsers,
}