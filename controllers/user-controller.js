const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { Op } = require('sequelize')
const _helpers = require('../_helpers')
const userServices = require('../services/user-services')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) {
      req.flash('danger_msg', '欄位未正確填寫')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
    if (password !== checkPassword) {
      req.flash('danger_msg', '輸入密碼不一致')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    try {
      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount) throw new Error('該帳號已被使用')
      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail) throw new Error('該email已被使用')

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      req.flash('success_msg', '註冊成功，請以新帳號登入')
      return res.redirect('/signin')
    } catch (e) {
      return next(e)
    }
  },
  // 登入
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功')
    return res.redirect('/tweets')
  },
  // 登出
  signOut: (req, res) => {
    if (req.user.role === 'user') {
      req.logout()
      req.flash('success_msg', "登出成功")
      return res.redirect('/signin')
    } else {
      req.logout()
      req.flash('success_msg', "登出成功")
      return res.redirect('/admin/signin')
    }
  },
  // User tweet 頁面 
  getUserTweets: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, tweetList, likeList] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: User, as: 'Followers', attributes: ['id'] },
          ],
        }),
        Tweet.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: Like, attributes: ['id'] }
          ],
          order: [['createdAt', 'DESC']],
        }),
        Like.findAll({
          where: { UserId: loginUserId },
          raw: true,
          attributes: ['TweetId']
        })
      ])
      const topUsers = await userServices.getTopUsers(loginUserId)

      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()
      loginUserAvatar = user.avatar
      user.isFollow = user.Followers.some(i => i.id === loginUserId)

      likeList = likeList.map(i => i.TweetId)
      tweetList = tweetList
        .map(i => {
          i = i.toJSON()
          return {
            ...i,
            isLike: likeList.some(j => j === i.id),
            loginUserAvatar,
            loginUserId
          }
        })

      res.render('user/user-tweets', { user, tweetList, loginUserId, topUsers })
    } catch (err) { next(err) }
  },
  // User Replies 頁面 
  getUserReplies: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, replyList] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] },
          ],
        }),
        Reply.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['name', 'account', 'avatar'] },
            { model: Tweet, attributes: ['id'], include: [User] }
          ],
          order: [['createdAt', 'DESC']],
        })
      ])
      const topUsers = await userServices.getTopUsers(loginUserId)

      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()
      user.isFollow = user.Followers.some(i => i.id === loginUserId)
      replyList = replyList
        .map(i => i.toJSON())

      res.render('user/user-replies', { user, replyList, loginUserId, topUsers })
    } catch (err) { next(err) }
  },
  // User likes 頁面
  getUserLikes: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, likeList, loginUserLikeList] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: User, as: 'Followers', attributes: ['id'] },
            { model: Tweet, attributes: ['id'] },
          ],
        }),
        Like.findAll({
          where: { UserId },
          include: [
            {
              model: Tweet,
              include: [
                { model: User, attributes: ['name', 'account', 'avatar'] },
                { model: Reply, attributes: ['id'] },
                { model: Like, attributes: ['id'] }
              ]
            },
          ],
          order: [['createdAt', 'DESC']],
        }),
        Like.findAll({
          where: { UserId: loginUserId },
          raw: true,
          attributes: ['TweetId']
        })
      ])
      const topUsers = await userServices.getTopUsers(loginUserId)

      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()
      loginUserAvatar = user.avatar
      user.isFollow = user.Followers.some(i => i.id === loginUserId)

      loginUserLikeList = loginUserLikeList.map(i => i.TweetId)
      likeList = likeList
        .map(i => {
          i = i.toJSON()
          return {
            ...i,
            isLike: loginUserLikeList.some(j => j === i.TweetId),
            loginUserId,
            loginUserAvatar
          }
        })

      res.render('user/user-likes', { user, likeList, loginUserId, topUsers })
    } catch (err) { next(err) }
  },
  // User Followings頁面
  getUserFollowings: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, loginUserFollowingList] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' },
            { model: Tweet, attributes: ['id'] },
          ],
        }),
        Followship.findAll({
          where: { followerId: loginUserId },
          raw: true
        })
      ])
      const topUsers = await userServices.getTopUsers(loginUserId)

      loginUserFollowingList = loginUserFollowingList.map(i => i.followingId)

      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()
      FollowingList = user.Followings
        .map(i => ({
          ...i,
          isFollow: loginUserFollowingList.some(j => i.id === j)
        }))
        .sort(function (a, b) {
          return b.Followship.createdAt.toLocaleString().localeCompare(a.Followship.createdAt.toLocaleString())
        })

      res.render('user/user-followings', { user, FollowingList, loginUserId, topUsers })
    } catch (err) { next(err) }
  },
  // User Followers頁面
  getUserFollowers: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, loginUserFollowingList] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' },
            { model: Tweet, attributes: ['id'] },
          ],
        }),
        Followship.findAll({
          where: { followerId: loginUserId },
          raw: true
        })
      ])
      const topUsers = await userServices.getTopUsers(loginUserId)

      loginUserFollowingList = loginUserFollowingList.map(i => i.followingId)

      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()
      FollowerList = user.Followers
        .map(i => ({
          ...i,
          isFollow: loginUserFollowingList.some(j => i.id === j)
        }))
        .sort(function (a, b) {
          return b.Followship.createdAt.toLocaleString().localeCompare(a.Followship.createdAt.toLocaleString())
        })

      res.render('user/user-followers', { user, FollowerList, loginUserId, topUsers })
    } catch (err) { next(err) }
  },
  getUserSetting: async (req, res, next) => {
    try {
      const UserId = Number(req.params.uid)
      const loginUserId = _helpers.getUser(req).id
      const { name, account, email } = req.query

      if (UserId !== loginUserId) throw new Error('無法瀏覽他人的編輯頁面')

      let user = await User.findByPk(UserId, {
        raw: true
      })

      if (!user) throw new Error('使用者不存在')
      user = {
        ...user,
        name: name || user.name,
        account: account || user.account,
        email: email || user.email
      }

      res.render('user/user-settings', { user, loginUserId })
    } catch (err) { next(err) }
  },
  postUserSetting: async (req, res, next) => {
    try {
      const UserId = Number(req.params.uid)
      const loginUserId = _helpers.getUser(req).id
      const errors = []

      const { account, name, email, password, checkPassword } = req.body

      if (name?.length > 50) errors.push('name字數超出上限')
      if (UserId !== loginUserId) errors.push('無法編輯他人的資料')
      if (password !== checkPassword) errors.push('密碼與確認密碼不一致')

      let [otherUser, user, hash] = await Promise.all([
        User.findAll({
          where: {
            [Op.or]: [{ account }, { email }]
          },
          raw: true
        }),
        User.findByPk(UserId),
        bcrypt.hash(password, 10)
      ])

      otherUser.forEach(u => {
        if (user.account !== account && u.account === account) errors.push('account已重複註冊')
        if (user.email !== email && u.email === email) errors.push('email已重複註冊')
      })

      if (errors.length) {
        errors.forEach(e => req.flash('danger_msg', e))
        return res.redirect(`/users/${UserId}/edit?account=${account}&name=${name}&email=${email}`)
      }

      await user.update({ account, name, email, password: hash })
      req.flash('success_msg', '修改成功')

      res.redirect(`/users/${UserId}/edit`)
    } catch (err) { next(err) }
  }
}

module.exports = userController