const helpers = require('../_helpers')
const { User, Followship, Tweet } = require('../models')

const profileController = {
  getUserTweets: async (req, res, next) => {
    // 取得loginUser(使用helpers), userId
    const loginUser = helpers.getUser(req)
    const userId = req.params.userId
    const route = 'tweets'
    try {
      // 取對應的user資料，包含following跟follower的count
      const [user, FollowingsCount, FollowersCount, tweets] = await Promise.all([
        User.findByPk(userId),
        // 計算user的folowing數量
        Followship.count({
          where: { followerId: userId }
        }),
        // 計算user的folower數量
        Followship.count({
          where: { followingId: userId }
        }),
        // 推文及推文數
        Tweet.findAndCountAll({
          raw: true,
          where: { UserId: userId }
        })
      ])
      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('該用戶不存在!')
      // 變數存，user是否為使用者
      const isLoginUser = user.id === loginUser.id
      // 將變數加入
      const userData = {
        ...user.toJSON(),
        FollowingsCount,
        FollowersCount,
        tweetsCount: tweets.count,
        isLoginUser
      }
      // render
      res.render('users/tweets', { user: userData, tweets: tweets.rows, route })
    } catch (err) {
      next(err)
    }
  },
  getUserFollows: (req, res) => {
    res.render('users/follow')
  },
  editUser: (req, res) => {
    res.render('users/edit')
  }
}

module.exports = profileController
