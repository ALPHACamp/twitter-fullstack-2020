const { User, Followship, Tweet } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const getUser = async (req, res, next) => {
  // 取得loginUser(使用helpers), userId
  const loginUser = helpers.getUser(req)
  const { userId } = req.params
  try {
    // 判斷session儲存的資料是否跟req相同
    if (req.session.userData?.id === userId) return next()
    // 取對應的user資料
    const user = await User.findByPk(userId)
    // 判斷user是否存在，沒有就err
    if (!user) throw new Error('該用戶不存在!')
    // 變數存，user是否為使用者
    const isLoginUser = user.id === loginUser.id

    // 取得following跟follower的count
    const [FollowingsCount, FollowersCount, tweetsCount] = await Promise.all([
      // 計算user的folowing數量
      Followship.count({
        where: { followerId: userId }
      }),
      // 計算user的folower數量
      Followship.count({
        where: { followingId: userId }
      }),
      // 推文及推文數
      Tweet.count({
        where: { UserId: userId }
      })
    ])

    // 將變數加入session
    req.session.userData = {
      ...user.toJSON(),
      cover: user.cover || '/images/profile/cover.png',
      avatar: user.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg',
      FollowingsCount,
      FollowersCount,
      tweetsCount,
      isLoginUser,
      isFollowing: isLoginUser ? null : loginUser.Followings.some(following => following.id === user.id)
    }
    // next
    return next()
  } catch (err) {
    next(err)
  }
}

const getTopFollowedUsers = (req, res, next) => {
  const loginUser = helpers.getUser(req)
  const topFollowedUsersNumber = 10
  return User.findAll({
    include: [{ model: User, as: 'Followers' }],
    where: { role: 'user', id: { [Op.not]: loginUser.id } }
  })
    .then(users => {
      const result = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: loginUser.Followings?.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      req.followingData = result.slice(0, topFollowedUsersNumber - 1)
      return next()
    })
    .catch(err => next(err))
}

module.exports = {
  getUser,
  getTopFollowedUsers
}
