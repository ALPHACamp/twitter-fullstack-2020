const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHelper } = require('../helpers/file-helpers')
const { User, Followship, Tweet, Reply, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

// 推文顯示數量
const DEFAULT_LIMIT = 50
let nav = 'profile'

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
        isLoginUser,
        isFollowing: isLoginUser ? null : loginUser.Followings.some(following => following.id === user.id)
      }
      // next
      return next()
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    const { userData, followingData } = req.session
    // 取得 id
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    const route = `users/${userId}/tweets`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    try {
      // tweets找相對應的資料，跟user關聯，依照建立時間排列
      // replies、likes數量計算
      const tweets = await Tweet.findAndCountAll({
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('Replies.id')), 'repliesCount']]
        },
        where: { UserId: userId },
        include: [
          User,
          // 不要引入reply資料
          { model: Reply, attributes: [] }
        ],
        order: [['createdAt', 'DESC']],
        group: ['Tweet.id'],
        limit,
        offset,
        subQuery: false
      })
      const likes = await Promise.all(
        tweets.rows.map(tweet =>
          Like.findAndCountAll({
            where: { TweetId: tweet.id }
          })
        )
      )
      // 整理資料
      const tweetsData = tweets.rows.map((tweet, index) => ({
        ...tweet.toJSON(),
        likesCount: likes[index].count,
        isLiked: likes[index].rows.some(like => like.UserId === loginUser.id)
      }))
      // pagination
      const pagination = getPagination(page, limit, tweets.count.length)
      // render
      const partialName = 'user-tweets'
      // res.render('users/tweets', { user: userData, tweets: tweetsData, route, pagination })
      res.render('index', { user: userData, tweets: tweetsData, route, pagination, partialName, nav, followingData })
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    const { userData, followingData } = req.session
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
      const partialName = 'user-replies'
      // render
      res.render('index', { user: userData, replies: repliesData, route, pagination, partialName, nav, followingData })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    const { userData, followingData } = req.session
    const loginUser = helpers.getUser(req)
    const { userId } = req.params
    const route = `users/${userId}/likes`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    try {
      // likes找相對應的資料，跟user推文者關聯，依照like建立時間排列
      const likes = await Like.findAndCountAll({
        where: { UserId: userId },
        include: [{ model: Tweet, include: [User] }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      const counts = await Promise.all(
        likes.rows.map(async like => ({
          repliesCount: await Reply.count({ where: { TweetId: like.TweetId } }),
          likesCount: await Like.count({ where: { TweetId: like.TweetId } })
        }))
      )
      // 整理資料
      const tweetsData = likes.rows.map((like, index) => ({
        ...like.Tweet.toJSON(),
        likesCount: counts[index].likesCount,
        repliesCount: counts[index].repliesCount,
        isLiked: loginUser.Likes.some(l => l.TweetId === like.TweetId)
      }))
      // pagination
      const pagination = getPagination(page, limit, likes.count)
      const partialName = 'user-likes'
      // render
      res.render('index', { user: userData, tweets: tweetsData, pagination, route, partialName, nav, followingData })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const { userId } = req.params
    const { followingData } = req.session
    // 判斷active
    const followings = true
    const route = `users/${userId}/followings`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    try {
      // 取對應的user資料、包含追隨的人、推文數
      const [user, tweetsCount, followingsCount] = await Promise.all([
        User.findByPk(userId, {
          include: [
            {
              model: User,
              as: 'Followings',
              order: [['createdAt', 'DESC']]
            }
          ],
          limit,
          offset
        }),
        Tweet.count({
          where: { UserId: userId }
        }),
        Followship.count({
          where: { followerId: userId }
        })
      ])
      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('帳號不存在!')
      // 判斷是否loginUser是否有追隨該user清單
      const isFollowing =
        // 清單中的id是否跟loginUser追蹤的id相同
        user.Followings.map(following => {
          return loginUser.Followings.some(f => f.id === following.id)
        })

      const userData = {
        ...user.toJSON(),
        tweetsCount
      }
      // 將isFollowing加入其中
      userData.Followings.forEach((following, index) => {
        following.isFollowing = isFollowing[index]
      })
      // 根據isFollowing排序
      userData.Followings.sort((a, b) => {
        if (loginUser.id === a.id || loginUser.id === b.id) return -1
        return b.isFollowing - a.isFollowing
      })
      // pagination
      const pagination = getPagination(page, limit, followingsCount)
      const partialName = 'user-followings'
      res.render('index', { user: userData, followings, pagination, route, partialName, nav, followingData })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const { userId } = req.params
    const { followingData } = req.session
    // 判斷active
    const followers = true
    const route = `users/${userId}/followers`
    // 取得page, limit, offset
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    try {
      // 取對應的user資料、包含追隨的人、推文數
      const [user, tweetsCount, followersCount] = await Promise.all([
        User.findByPk(userId, {
          include: [
            // Followers
            { model: User, as: 'Followers', order: [['createdAt', 'DESC']] }
          ],
          limit,
          offset
        }),
        Tweet.count({
          where: { UserId: userId }
        }),
        Followship.count({
          where: { followingId: userId }
        })
      ])

      // 判斷user是否存在，沒有就err
      if (!user) throw new Error('帳號不存在!')
      // 判斷是否loginUser是否有追隨該user清單
      const isFollowing =
        // 清單中的id是否跟loginUser追蹤的id相同
        user.Followers.map(follower => {
          return loginUser.Followings.some(f => f.id === follower.id)
        })
      const userData = {
        ...user.toJSON(),
        tweetsCount
      }
      // 將isFollowing加入其中
      userData.Followers.forEach((follower, index) => {
        follower.isFollowing = isFollowing[index]
      })
      // 根據isFollowing排序
      userData.Followers.sort((a, b) => b.isFollowing - a.isFollowing)
      // pagination
      const pagination = getPagination(page, limit, followersCount)
      const partialName = 'user-followers'
      res.render('index', { user: userData, followers, pagination, route, partialName, nav, followingData })
    } catch (err) {
      next(err)
    }
  },
  editUserAccount: async (req, res, next) => {
    nav = 'setting'
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
      if (!user) throw new Error('帳號不存在!')
      const partialName = 'user-edit'
      const visibleToggle = 'invisible'
      // render
      return res.render('index', { user, partialName, visibleToggle })
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
      if (!user) throw new Error('帳號不存在!')
      // 如果account、email有更動就判斷是否有重複
      if (user.account !== account && isAccountExist) throw new Error('account已重複註冊!')
      if (user.email !== email && isEmailExist) throw new Error('email已重複註冊!')
      // 確認name有無超過50字，introduction有無超過150字
      if (name?.length > 50) throw new Error('字數超出上限!')
      if (introduction?.length > 150) throw new Error('字數超出上限!')
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
