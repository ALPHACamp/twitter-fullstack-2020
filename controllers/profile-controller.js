const Sequelize = require('sequelize')

const helpers = require('../_helpers')
const { User, Followship, Tweet, Reply, Like } = require('../models')
const { group } = require('console')

const profileController = {
  getUser: async (req, res, next) => {
    // 取得loginUser(使用helpers), userId
    const loginUser = helpers.getUser(req)
    const userId = req.params.userId
    try {
      // 取對應的user資料，包含following跟follower的count
      const [user, FollowingsCount, FollowersCount, tweetsCount] = await Promise.all([
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
        Tweet.count({
          where: { UserId: userId }
        })
      ])
      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('該用戶不存在!')
      // 變數存，user是否為使用者
      const isLoginUser = user.id === loginUser.id
      // 將變數加入
      req.userData = {
        ...user.toJSON(),
        cover: user.cover || '/images/profile/cover.png',
        avatar: user.avatar || '/images/profile/avatar.png',
        FollowingsCount,
        FollowersCount,
        tweetsCount,
        isLoginUser
      }
      // next
      next()
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    const { userData } = req
    // 取得 id
    const userId = req.params.userId
    try {
      // tweets找相對應的資料，跟user關聯，依照建立時間排列
      // replies、likes數量計算
      const tweets = await Tweet.findAll({
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('Replies.id')), 'repliesCount'],
            [Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likesCount']
          ]
        },
        where: { UserId: userId },
        include: [
          User,
          // 不要引入reply資料
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ],
        order: [['createdAt', 'DESC']],
        group: ['Tweet.id']
      })
      // 整理資料
      const tweetsData = tweets.map(tweet => tweet.toJSON())
      // render
      res.render('users/tweets', { user: userData, tweets: tweetsData })
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    const { userData } = req
    // 取得userId
    const userId = req.params.userId
    try {
      // 取得reply資料及回覆的推文者
      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            include: [
              // 只取回覆的推文者
              { model: User, attributes: ['account'] }
            ],
            // 不能是空的
            attributes: ['id']
          }
        ]
      })
      // 整理資料
      const repliesData = replies.map(reply => reply.toJSON())
      console.log(userData)
      // render
      res.render('users/replies', { user: userData, replies: repliesData })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: (req, res) => {
    res.render('users/likes', { user: userData })
  },
  getUserFollows: (req, res) => {
    res.render('users/likes')
  },
  editUser: (req, res) => {
    res.render('users/edit')
  }
}

module.exports = profileController
