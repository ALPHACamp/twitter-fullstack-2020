const User = require('./models').User

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}
const getTopuser = (currentUser) => {
  return User.findAll({
    include: [
      { model: User, as: 'Followers' }
    ]
  })
  .then(users => {
    //去除admin
    users = users.filter((user) => {
      console.log(user.role)
      return user.role === 'user'
    })
    // 整理 users 資料
    users = users.map((user) => ({
      ...user.dataValues,
      // 計算追蹤者人數
      FollowerCount: user.Followers.length,
      // 判斷目前登入使用者是否已追蹤該 User 物件
      isFollowed: currentUser.Followings.map(d => d.id).includes(user.id)
    }))
    // 依追蹤者人數排序清單
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    // console.log(users)
    return users
  })
}

module.exports = {
  ensureAuthenticated,
  getUser,
  getTopuser,
};