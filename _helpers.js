const bcrypt = require('bcryptjs')
const db = require('./models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet


function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

// function getUserFollow(req) {
//   // 撈出所有 User 與 followers 資料
//   return User.findAll({
//     include: [
//       { model: User, as: 'Followers' }
//     ]
//   }).then(users => {
//     // 整理 users 資料
//     users = users.map(user => ({
//       ...user.dataValues,
//       // 計算追蹤者人數
//       FollowerCount: user.Followers.length,
//       // 判斷目前登入使用者是否已追蹤該 User 物件
//       isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
//     }))
//     // 依追蹤者人數排序清單
//     users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
//     return users
//   })
// }


module.exports = {
  ensureAuthenticated,
  getUser,
  //getUserFollow
};