const db = require('./models')
const User = db.User


function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function isMatch(a , b) {
  if (a === b) { 
    return true
  } else {
    return false
    }
  }

  function getPopularUsers(req) {
    return User.findAll({ 
      where: { role: 'normal' },
      include: { model: User, as: 'Followers' }
    }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        popularUsers = users.sort((a, b) => b.FollowerCount - a.FollowerCount ).slice(0,10)
        return popularUsers
      })
  }

module.exports = {
  ensureAuthenticated,
  getUser,
  isMatch,
  getPopularUsers
};