const { User, Tweet, Reply, Followship } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { removeAllSpace, removeOuterSpace } = require('../_helpers')
const { imgurFileHandler } = require('../_helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const errors = []
      let { account, name, email, password, checkPassword } = req.body

      if (!account || !email || !password) {
        errors.push({ message: '請確認必填欄位' })
      }

      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) errors.push({ message: '帳號已被註冊' })

      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) errors.push({ message: '信箱已被註冊' })

      if (password !== checkPassword) errors.push({ message: '密碼輸入不相同' })

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (name.length > 50) errors.push({ message: '名稱長度限制50字元以內' })
      if (!name) name = account

      if (errors.length) {
        return res.render('signup', { errors, account, name, email })
      }

      const hash = bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
      await User.create({ account, name, email, password: hash })

      req.flash('success_messages', '您已成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: async (req, res, next) => {
    try {
      res.render('signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = Number(req.user.id) // 登入的使用者
      const UserId = Number(req.params.id) || userId // 如果有傳入 params.id 就帶入 params.id 如果沒有就帶入 user.id
      const queryUserId = userId !== UserId ? UserId : userId // 如果 userId !== UserId 代表正在瀏覽他人頁面

      const [queryUserData, tweets, followships] = await Promise.all([
        // 這部分之後可以再優化 userId !== UserId 的時候才需要做
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Tweet.findAll({
          include: [
            Reply,
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: User,
              as: 'LikedUsers'
            }
          ],
          where: { UserId: queryUserId }, // 這裏是帶入 queryUserId 搜尋
          order: [['createdAt', 'DESC']]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!queryUserData) throw new Error('使用者不存在 !')

      // 獨立處理 queryUser 的資料
      const queryUser = queryUserData.toJSON()
      // 判斷正在瀏覽的頁面，使用者是否為自己
      queryUser.isSelf = userId === UserId
      // 判斷正在瀏覽的頁面，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = req.user.Followings.some(
        item => item.id === queryUser.id
      )

      // 獨立處理 tweets 的資料
      tweets.forEach(function (tweet, index) {
        this[index] = { ...tweet.toJSON() }
      }, tweets)

      // 獨立處理 rightColumn 的資料
      const followshipData = followships
        .map(followship => ({
          ...followship.toJSON(),
          followerCounts: followship.Followers.length,
          isFollowed: followship.Followers.some(item => item.id === userId),
          isSelf: userId !== followship.id
        }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.render('user', {
        queryUser,
        tweets,
        followships: followshipData,
        tab: 'getTweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)

      const [user, replies, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Reply.findAll({
          where: { userId },
          include: [{ model: Tweet, include: User }],
          order: [['createdAt', 'DESC']]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!user) throw new Error('使用者不存在 !')

      replies.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, replies)

      const followshipData = followships
        .map(followship => ({
          ...followship.toJSON(),
          followerCounts: followship.Followers.length,
          isFollowed: followship.Followers.some(item => item.id === userId),
          isSelf: userId !== followship.id
        }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.render('user', {
        user: user.toJSON(),
        replies,
        followships: followshipData,
        tab: 'getReplies'
      })
    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' },
            {
              model: Tweet,
              as: 'LikedTweets',
              include: [User, Reply, { model: User, as: 'LikedUsers' }]
            }
          ]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const followshipData = followships
        .map(followship => ({
          ...followship.toJSON(),
          followerCounts: followship.Followers.length,
          isFollowed: followship.Followers.some(item => item.id === userId),
          isSelf: userId !== followship.id
        }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.render('user', {
        user: user.toJSON(),
        followships: followshipData,
        tab: 'getLikedTweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!user) throw new Error('使用者不存在 !')

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      data.Followers.forEach(
        user => (user.isFollowed = followingUserId.includes(user.id))
      )

      const followshipData = followships
        .map(followship => ({
          ...followship.toJSON(),
          followerCounts: followship.Followers.length,
          isFollowed: followship.Followers.some(item => item.id === userId),
          isSelf: userId !== followship.id
        }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.render('followship', {
        user: data, // display the followers of user, including the followings and followers
        followships: followshipData, // rightColumn
        tab: 'getFollowers'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!user) throw new Error('使用者不存在 !')

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      data.Followers.forEach(
        user => (user.isFollowed = followingUserId.includes(user.id))
      )

      const followshipData = followships
        .map(followship => ({
          ...followship.toJSON(),
          followerCounts: followship.Followers.length,
          isFollowed: followship.Followers.some(item => item.id === userId),
          isSelf: userId !== followship.id
        }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      console.log(followshipData)
      res.render('followship', {
        user: data, // display the followings of user
        followships: followshipData, // rightColumn
        tab: 'getFollowings'
      })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const userId = Number(req.user.id)
      const UserId = Number(req.body.UserId) // other user
      if (userId === UserId) throw new Error("You can't follow yourself!")

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) throw new Error('使用者不存在 !')

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      if (followingUserId.includes(UserId)) {
        throw new Error('您已經追蹤過此使用者了 !')
      }

      await Followship.create({ followerId: userId, followingId: UserId })

      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const userId = Number(req.user.id)
      const UserId = Number(req.params.id) // other user
      if (userId === UserId) throw new Error("You can't unfollow yourself!")

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) throw new Error('使用者不存在 !')

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      if (!followingUserId.includes(UserId)) {
        throw new Error('您還未追蹤此使用者 !')
      }

      await Followship.destroy({
        where: { followerId: userId, followingId: UserId }
      })

      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
