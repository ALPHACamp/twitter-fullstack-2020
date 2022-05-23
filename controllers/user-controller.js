const { User, Tweet, Reply, Followship, Like } = require('../models')
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
      const errors_messages = []
      let { account, name, email, password, checkPassword } = req.body

      if (!account || !email || !password) {
        errors_messages.push({ message: '請確認必填欄位' })
      }

      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) errors_messages.push({ message: '帳號已被註冊' })

      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) errors_messages.push({ message: '信箱已被註冊' })

      if (password !== checkPassword) errors_messages.push({ message: '密碼輸入不相同' })

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (name.length > 50) errors_messages.push({ message: '名稱長度限制50字元以內' })
      if (!name) name = account

      if (errors_messages.length) {
        return res.render('signup', { errors_messages, account, name, email })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
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
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, tweets] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
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
          where: { UserId: queryUserId },
          order: [['createdAt', 'DESC']]
        })
      ])
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      tweets.forEach(function (tweet, index) {
        this[index] = {
          ...tweet.toJSON(),
          isLiked: tweet.LikedUsers.some(item => item.id === userId)
        }
      }, tweets)
      return res.render('user', {
        queryUser,
        tweets,
        tab: 'getTweets',
        leftColTab: 'userInfo'
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, replies] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        Reply.findAll({
          where: { UserId: queryUserId },
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
        })
      ])
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      replies.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, replies)

      return res.render('user', {
        queryUser,
        replies,
        tab: 'getReplies',
        leftColTab: 'userInfo'
      })
    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData, likedTweets] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        Like.findAll({
          where: { UserId: queryUserId },
          attributes: ['id', 'createdAt'],
          include: [{
            model: Tweet,
            attributes: ['id', 'description', 'createdAt'],
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
              { model: Reply, attributes: ['id'] },
              { model: User, as: 'LikedUsers', attributes: ['id'] }
            ]
          }],
          order: [['createdAt', 'DESC']]
        })
      ])
      if (!queryUserData) throw new Error("User didn't exist!")

      likedTweets.forEach(function (likedTweet, index) {
        this[index] = {
          ...likedTweet.toJSON(),
          isLiked: likedTweet.Tweet.LikedUsers.some(item => item.id === userId),
          isSelf: userId === queryUserId
        }
      }, likedTweets)

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)

      return res.render('user', {
        queryUser,
        likedTweets,
        tab: 'getLikedTweets',
        leftColTab: 'userInfo'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            {
              model: User,
              as: 'Followers',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            { model: Tweet, attributes: ['id'] }
          ]
        })
      ])
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followers.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })

      return res.render('followship', {
        queryUser,
        tab: 'getFollowers'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)

      const [queryUserData] = await Promise.all([
        User.findByPk(queryUserId, {
          include: [
            {
              model: User,
              as: 'Followings',
              attributes: ['id', 'name', 'avatar', 'introduction'],
              order: [['createdAt', 'DESC']]
            },
            { model: Tweet, attributes: ['id'] }
          ]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      queryUser.isSelf = queryUserId === userId
      queryUser.isFollowed = helpers
        .getUser(req)
        .Followings.some(item => item.id === queryUser.id)
      queryUser.Followings.forEach(user => {
        user.isFollowed = helpers
          .getUser(req)
          .Followings.some(item => item.id === user.id)
        user.isSelf = user.id !== userId
      })

      res.render('followship', {
        queryUser,
        tab: 'getFollowings'
      })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.body.id)
      if (userId === queryUserId) {
        req.flash('error_messages', '您不能追蹤自己 !')
        return res.redirect(200, 'back')
      }

      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }]
      })
      if (!user) {
        req.flash('error_messages', '使用者不存在 !')
        return res.redirect(200, 'back')
      }

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) {
        req.flash('error_messages', '使用者不存在 !')
        return res.redirect(200, 'back')
      }

      const followingUserId = user.Followings.map(user => user.id)
      if (followingUserId.includes(queryUserId)) {
        req.flash('error_messages', '您已經追蹤過此使用者了 !')
        return res.redirect(200, 'back')
      }

      await Followship.create({ followerId: userId, followingId: queryUserId })
      req.flash('success_messages', '成功追蹤')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
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
      req.flash('success_messages', '成功取消追蹤')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  userSettingPage: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId !== queryUserId) {
        throw new Error('您沒有權限瀏覽他人頁面 !')
      }

      const queryUserData = await User.findByPk(queryUserId)
      if (!queryUserData) throw new Error('使用者不存在 !')

      const queryUser = queryUserData.toJSON()
      delete queryUser.password

      return res.render('setting', { queryUser, leftColTab: 'userSetting' })
    } catch (err) {
      next(err)
    }
  },
  userSetting: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      let { account, name, email, password, confirmPassword } = req.body

      if (!account || !email) {
        req.flash('error_messages', '帳號或 email 必填欄位未填寫完整 !')
        return res.redirect('back')
      }
      if (password !== confirmPassword) {
        req.flash('error_messages', '密碼與密碼再確認不相符 !')
        return res.redirect('back')
      }
      if (name.length > 50) {
        req.flash('error_messages', '名稱長度限制 50 字元以內 !')
        return res.redirect('back')
      }
      if (userId !== queryUserId) {
        req.flash('error_messages', '您沒有權限編輯使用者 !')
        return res.redirect('back')
      }

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (!name) name = account

      const queryUser = await User.findByPk(queryUserId)
      if (!queryUser) {
        req.flash('error_messages', '使用者不存在 !')
        return res.redirect('back')
      }
      if (account !== queryUser.account) {
        const matchedAccount = await User.findOne({ where: { account } })
        if (matchedAccount) {
          req.flash('error_messages', '此帳號已被其他使用者使用了 !')
          return res.redirect('back')
        }
      }
      if (email !== queryUser.email) {
        const matchedEmail = await User.findOne({ where: { email } })
        if (matchedEmail) {
          req.flash('error_messages', '此 email 已被其他使用者使用了 !')
          return res.redirect('back')
        }
      }
      if (password && await bcrypt.compareSync(password, queryUser.password)) {
        req.flash('error_messages', '新密碼不能與舊密碼相同 !')
        return res.redirect('back')
      }

      const hash = password ? await bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : queryUser.password
      const updatedQueryUser = await queryUser.update({ account, name, email, password: hash })
      const data = updatedQueryUser.toJSON()
      delete data.password

      req.flash('success_messages', '成功儲存設定')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
