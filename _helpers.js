function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function getTopUsers(req, users) {

  return users.map(user => ({
    ...user.dataValues,
    followerCount: user.Followers.length,
    isFollowed: req.user.Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
  })).sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, 10)
}

module.exports = {
  ensureAuthenticated,
  getUser,
  getTopUsers,
};