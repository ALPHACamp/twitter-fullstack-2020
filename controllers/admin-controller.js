const { User, Tweet, Like } = require('../models')

const adminController = {
  // 取得後台登入頁面
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },

  // 送出登入資訊
  signIn: (req, res) => {
    res.redirect(302, '/admin/tweets')
  },

  // 取得所有使用者貼文
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(tweet => ({
          ...tweet.toJSON(),
          description: tweet.description.substring(0, 50)
        }))
        return res.render('admin/admin-tweets', { tweets: data, isHomePage: true })
      })
      .catch(err => next(err))
  },

  // 取得所有使用者資訊
  getUsers: async (req, res, next) => {
    // 取出所有 role: 'user' 的使用者 id
    try {
      const userId = await User.findAll({
        raw: true,
        nest: true,
        attributes: ['id'],
        where: { role: 'user' }
      })
      // 將變數命名為 users
      const users = userId.map(user => user.id)

      // 新增存放資料的陣列
      const usersData = []

      // 查詢 users 陣列中的每一位 user
      for (const user of users) {
        const userData = await Promise.all([
          // 查詢這一位 user 的 followers, followings, tweets
          User.findByPk(user, {
            nest: true,
            include: [
              { model: User, as: 'Followers' },
              { model: User, as: 'Followings' },
              { model: Tweet }
            ]
          }),
          // 查詢這一位 user 被按讚的 tweet
          Like.findAll({
            raw: true,
            nest: true,
            include: [
              { model: Tweet, attributes: [], include: [{ model: User, attributes: ['id'], raw: true, nest: true }] }
            ],
            where: { userId: user }
          })
        ])
          .then(([user, likes]) => {
            // 計算這一位各項資料數量後, 新增到新的物件
            const userDataCount = {
              ...user.toJSON(),
              tweetCount: user.Tweets.length,
              followingCount: user.toJSON().Followings.length,
              followerCount: user.toJSON().Followers.length,
              likeCount: likes.length
            }
            // 將這一位 user 的資料傳回給 userData
            return userDataCount
          })
          .catch(err => next(err))
        // 將這一次的 userData push 到外部的 usersData 完成這一次的迴圈
        usersData.push(userData)
      }
      // 迴圈跑完後, 以陣列內每一筆資料的 tweetCount 多寡來做排序
      usersData.sort((a, b) => b.tweetCount - a.tweetCount)
      // console.log(usersData)
      res.render('admin/admin-users', { users: usersData, isProfile: true })
    } catch (err) {
      next(err)
    }
  },

  // 刪除貼文
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect(302, '/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
