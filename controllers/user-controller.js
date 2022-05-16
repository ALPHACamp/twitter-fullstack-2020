const { User, Tweet, Reply, Followship } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { removeAllSpace, removeOuterSpace } = require('../_helpers')
const helpers = require('../_helpers')

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
      const userId = helpers.getUser(req).id // 登入的使用者
      const queryUserId = Number(req.params.id) // 瀏覽的使用者，有可能是其他 user

      const [queryUserData, tweets, followships] = await Promise.all([
        // 這部分之後可以再優化 userId !== UserId 的時候才需要做
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] }, // 提供給 Followers 的數量計算
            { model: User, as: 'Followings', attributes: ['id'] }, // 提供給 Followings 的數量計算
            { model: Tweet, attributes: ['id'] } // 提供給 tweets 的數量計算
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
              as: 'LikedUsers',
              attributes: ['id']
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
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己
      queryUser.isSelf = queryUserId === userId
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      // 獨立處理 tweets 的資料
      tweets.forEach(function (tweet, index) {
        this[index] = {
          ...tweet.toJSON(),
          isLiked: tweet.LikedUsers.some(item => item.id === queryUserId)
        }
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
      const userId = helpers.getUser(req).id // 登入的使用者
      const queryUserId = Number(req.params.id) // 瀏覽的使用者，有可能是其他 user

      const [queryUserData, replies, followships] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] }, // 提供給 Followers 的數量計算
            { model: User, as: 'Followings', attributes: ['id'] }, // 提供給 Followings 的數量計算
            { model: Tweet, attributes: ['id'] } // 提供給 tweets 的數量計算
          ]
        }),
        Reply.findAll({
          where: { UserId: queryUserId }, // 這裏是帶入 queryUserId 搜尋
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: Tweet,
              include: [{ model: User, attributes: ['id', 'account'] }]
            }
          ],
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
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己
      queryUser.isSelf = queryUserId === userId
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      // 獨立處理 replies 的資料
      replies.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, replies)

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
      const userId = helpers.getUser(req).id // 登入的使用者
      const queryUserId = Number(req.params.id) // 瀏覽的使用者，有可能是其他 user

      const [queryUserData, followships] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] }, // 提供給 Followers 的數量計算
            { model: User, as: 'Followings', attributes: ['id'] }, // 提供給 Followings 的數量計算
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
      if (!queryUserData) throw new Error("User didn't exist!")

      // 獨立處理 queryUser 的資料
      const queryUser = queryUserData.toJSON()
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己
      queryUser.isSelf = queryUserId === userId
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

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
        followships: followshipData,
        tab: 'getLikedTweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id // 登入的使用者
      const queryUserId = Number(req.params.id) // 瀏覽的使用者，有可能是其他 user

      const [queryUserData, followships] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            {
              model: User,
              as: 'Followers',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            // { model: User, as: 'Followings' },
            { model: Tweet, attributes: ['id'] } // 提供給 tweets 的數量計算
          ]
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
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己
      queryUser.isSelf = queryUserId === userId
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      // 判斷 queryUser 的 followers 是否為已為 user 的 followings
      queryUser.Followers.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })

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

      res.render('followship', {
        queryUser, // display the followers of user, including the followings and followers
        followships: followshipData, // rightColumn
        tab: 'getFollowers'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id // 登入的使用者
      const queryUserId = Number(req.params.id) // 瀏覽的使用者，有可能是其他 user

      const [queryUserData, followships] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            // { model: User, as: 'Followers' },
            {
              model: User,
              as: 'Followings',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            { model: Tweet, attributes: ['id'] } // 提供給 tweets 的數量計算
          ]
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
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己
      queryUser.isSelf = queryUserId === userId
      // 判斷正在瀏覽的 “個人頁面”，使用者是否為自己 “已追蹤” 的使用者
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      // 判斷 queryUser 的 followers 是否為已為 user 的 followings
      queryUser.Followings.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })

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
        queryUser, // display the followings of user
        followships: followshipData, // rightColumn
        tab: 'getFollowings'
      })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.body.id) // other user
      // if (userId === queryUserId) throw new Error('您不能追蹤自己 !')
      if (userId === queryUserId) {
        req.flash('error_messages', '您不能追蹤自己 !')
        return res.redirect(200, 'back')
      }

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      // if (!user) throw new Error('使用者不存在 !')
      if (!user) {
        req.flash('error_messages', '使用者不存在 !')
        return res.redirect(200, 'back')
      }

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      // if (!queryUser) throw new Error('使用者不存在 !')
      if (!queryUser) {
        req.flash('error_messages', '使用者不存在 !')
        return res.redirect(200, 'back')
      }

      const followingUserId = user.Followings.map(user => user.id)
      // if (followingUserId.includes(queryUserId)) {
      //   throw new Error('您已經追蹤過此使用者了 !')
      // }
      if (followingUserId.includes(queryUserId)) {
        req.flash('error_messages', '您已經追蹤過此使用者了 !')
        return res.redirect(200, 'back')
      }

      await Followship.create({ followerId: userId, followingId: queryUserId })

      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id) // other user
      if (userId === queryUserId) {
        throw new Error('您不能取消追蹤自己 !')
      }

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) throw new Error('使用者不存在 !')

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) throw new Error('使用者不存在 !')

      const followingUserId = user.Followings.map(user => user.id)
      if (!followingUserId.includes(queryUserId)) {
        throw new Error('您還未追蹤此使用者 !')
      }

      await Followship.destroy({
        where: { followerId: userId, followingId: queryUserId }
      })

      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      res.render('edit')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
