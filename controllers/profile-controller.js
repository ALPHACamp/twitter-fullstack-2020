const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHelper } = require('../helpers/file-helpers')
const { User, Followship, Tweet, Reply, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

// 推文顯示數量
const DEFAULT_LIMIT = 3

const profileController = {
  getUser: async (req, res, next) => {
    // 取得loginUser(使用helpers), userId
    const loginUser = helpers.getUser(req)
    const { userId } = req.params
    try {
      // 判斷session儲存的資料是否跟req相同
      if (req.session.userData?.id === userId) return next()
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
      // 將變數加入session
      req.session.userData = {
        ...user.toJSON(),
        cover: user.cover || '/images/profile/cover.png',
        avatar: user.avatar || 'https://ionicframework.com/docs/img/demos/avatar.svg',
        FollowingsCount,
        FollowersCount,
        tweetsCount,
        isLoginUser
      }
      // next
      return next()
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    const { userData, previousPage, previousPageId } = req.session
    // 取得 id
    const { userId } = req.params
    const route = `users/${userId}/tweets`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT * page
    const offset = getOffset(page, limit)
    try {
      // tweets找相對應的資料，跟user關聯，依照建立時間排列
      // replies、likes數量計算
      const tweets = await Tweet.findAndCountAll({
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
        group: ['Tweet.id'],
        limit,
        offset,
        subQuery: false
      })
      // 整理資料
      const tweetsData = tweets.rows.map(tweet => tweet.toJSON())
      // pagination
      const pagination = getPagination(page, limit, tweets.count.length)
      // render
      res.render('users/tweets', { user: userData, tweets: tweetsData, route, pagination, previousPage, previousPageId })
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    const { userData } = req.session
    // 取得userId
    const { userId } = req.params
    const route = `users/${userId}/replies`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    try {
      // 取得reply資料及回覆的推文者
      const replies = await Reply.findAndCountAll({
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
        ],
        limit,
        offset
      })
      // 整理資料
      const repliesData = replies.rows.map(reply => reply.toJSON())
      // pagination
      const pagination = getPagination(page, limit, replies.count)
      // render
      res.render('users/replies', { user: userData, replies: repliesData, route, pagination })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    const { userData } = req.session
    const { userId } = req.params
    try {
      // likes找相對應的資料，跟user推文者關聯，依照like建立時間排列
      const likes = await Like.findAll({
        where: { UserId: userId },
        include: [Tweet],
        order: [['createdAt', 'DESC']]
      })
      // 透過likeId找對應的tweet資料
      // replies、likes數量計算
      const tweets = await Promise.all(
        likes.map(like => {
          return Tweet.findByPk(like.TweetId, {
            attributes: {
              include: [
                [Sequelize.fn('COUNT', Sequelize.col('Replies.id')), 'repliesCount'],
                [Sequelize.fn('COUNT', Sequelize.col('Likes.id')), 'likesCount']
              ]
            },
            include: [
              User,
              // 不要引入reply資料
              { model: Reply, attributes: [] },
              { model: Like, attributes: ['createdAt'] }
            ],
            group: ['Tweet.id']
          })
        })
      )
      // 整理資料
      console.log(tweets)
      const tweetsData = tweets.map(tweet => ({ ...tweet?.toJSON() }))
      // render
      res.render('users/likes', { user: userData, tweets: tweetsData })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    const { userId } = req.params
    // 判斷active
    const followings = true
    try {
      // 取對應的user資料、包含追隨的人、推文數
      const [user, tweetsCount] = await Promise.all([
        User.findByPk(userId, {
          include: [{ model: User, as: 'Followings', order: [['createdAt', 'DESC']] }]
        }),
        Tweet.count({
          where: { UserId: userId }
        })
      ])
      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('該用戶不存在!')
      const userData = {
        ...user.toJSON(),
        tweetsCount
      }
      res.render('users/followings', { user: userData, followings })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const { userId } = req.params
    // 判斷active
    const followers = true
    try {
      // 取對應的user資料、包含追隨的人、推文數
      const [user, tweetsCount] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers', order: [['createdAt', 'DESC']] },
            { model: User, as: 'Followings' }
          ]
        }),
        Tweet.count({
          where: { UserId: userId }
        })
      ])
      // 判斷是否為本人，不是的話就back
      if (user.id !== loginUser.id) return res.redirect('back')
      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('該用戶不存在!')
      // 追隨者的資料
      const userFollowersData = user.Followers.map(follower => ({
        ...follower.toJSON(),
        // 追隨者的id對應到user追隨的id
        isFollowed: user.Followings.some(following => follower.id === following.id)
      }))
      const userData = {
        ...user.toJSON(),
        tweetsCount
      }
      res.render('users/followers', { user: userData, followers, userFollowers: userFollowersData })
    } catch (err) {
      next(err)
    }
  },
  editUserAccount: async (req, res, next) => {
    // 抓id
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    // 判斷是否為本人
    if (loginUser.id !== Number(userId)) return res.redirect('back')
    try {
      // 找對應user、取出帳號、名稱、信箱
      const user = await User.findByPk(userId, {
        raw: true
      })
      // 找不到就報錯
      if (!user) throw new Error('該用戶不存在!')
      // render
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    // 取出照片檔
    const cover = req.files?.cover ? req.files.cover[0] : null
    const avatar = req.files?.avatar ? req.files.avatar[0] : null
    // 抓id, 表單資料
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    const { account, name, email, password, passwordCheck, introduction, coverDelete } = req.body
    const saltNumber = 10
    // 判斷是否為本人
    if (loginUser.id !== Number(userId)) return res.redirect('back')
    try {
      // 找對應user、找出是否有account、email
      const [user, isAccountExist, isEmailExist, coverFilePath, avatarFilePath] = await Promise.all([
        User.findByPk(userId),
        // 如果account, email有值得話就搜尋
        User.findOne({ where: { account: account || '' } }),
        User.findOne({ where: { email: email || '' } }),
        imgurFileHelper(cover),
        imgurFileHelper(avatar)
      ])
      // 找不到就報錯
      if (!user) throw new Error('該用戶不存在!')
      // 如果account、email有更動就判斷是否有重複
      if (user.account !== account && isAccountExist) throw new Error('該帳號已存在!')
      if (user.email !== email && isEmailExist) throw new Error('該email已存在!')
      // 確認name有無超過50字，introduction有無超過150字
      if (name?.length > 50) throw new Error('該名字超過字數上限!')
      if (introduction?.length > 150) throw new Error('該敘述超過字數上限!')
      // 確認密碼是否正確
      if (password !== passwordCheck) throw new Error('密碼不一致!')
      // 將密碼hash
      let hashedPassword = 0
      if (password) {
        const salt = bcrypt.genSaltSync(saltNumber)
        hashedPassword = bcrypt.hashSync(password, salt)
      }
      // 如果coverFilePath是空的，且coverDelete是同意的，就將cover刪除
      if (!coverFilePath && coverDelete === 'on') {
        user.cover = ''
      }
      // 更新資料
      await user.update({
        // 如果是空的就代入資料庫的值
        name: name || user.name,
        email: email || user.email,
        account: account || user.account,
        password: hashedPassword || user.password,
        introduction: introduction || user.introduction,
        cover: coverFilePath || user.cover,
        avatar: avatarFilePath || user.avatar
      })
      // redirect /tweets
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = profileController
