const { User, Tweet, Reply, Followship, Like } = require('../models')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼與密碼確認不相符!')
    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位為必填')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([account, email]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ account, name, email, password: hash, role: 'user' }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (getUser(req).role === 'admin') {
      req.flash('error_messages', '請前往後台登入')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  tweets: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      Tweet.findAll({
        where: { UserId: id },
        include: [Like, Reply],
        order: [['createdAt', 'desc']],
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
    .then(([targetUser, tweets, followship]) => {
      if (!targetUser) throw new Error("User didn't exist")
      const user = getUser(req)
      user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
      const users = followship
        .map(data => ({
          ...data.User.toJSON(),
          isFollowed: user.Followings.some(u => u.id === data.followingId)
        }))
        .slice(0, 10)
      const tweetsData = tweets
        .map(t => ({
          ...t.toJSON(),
          likedCount: t.Likes.length,
          repliedCount: t.Replies.length,
          isLiked: t.Likes.some(like => like.UserId === user.id)
        }))
      res.locals.tweetsLength = tweets.length
      res.render('profile', { targetUser: targetUser.toJSON(), tweets: tweetsData, user, users })
    })
    .catch(err => next(err))
  },
  replies: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          Tweet
        ]
      }),
      Reply.findAll({
        where: { UserId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, replies, followship]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: user.Followings.some(u => u.id === data.followingId)
          }))
          .slice(0, 10)
        res.locals.tweetsLength = targetUser.Tweets.length
        res.status(200).render('profile', { targetUser: targetUser.toJSON(), replies, user, users })
      })
      .catch(err => next(err))
  },
  likes: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          Tweet
        ]
      }),
      Like.findAll({
        where: { UserId: id },
        include: [
          { model: Tweet, include: User },
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply }
        ],
        order: [['createdAt', 'desc']],
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, likes, followship]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: user.Followings.some(u => u.id === data.followingId)
          }))
          .slice(0, 10)
        const likesData = likes
          .map(l => ({
            ...l.toJSON(),
            likedCount: l.Tweet.Likes.length,
            repliedCount: l.Tweet.Replies.length,
            isLiked: l.Tweet.Likes.some(like => like.UserId === user.id)
          }))
        res.locals.tweetsLength = targetUser.Tweets.length
        res.status(200).render('profile', { targetUser: targetUser.toJSON(), likes: likesData, user, users })
      })
      .catch(err => next(err))
  },
  followers: (req, res, next) => {
    const observedUserId = req.params.id
    const loginUser = getUser(req)

    return User.findByPk(observedUserId, {
      nest: true,
      include: [Tweet, { model: User, as: 'Followers' }]
    })
      .then(user => {
        const result = user.Followers.map(user => {
          return {
            ...user.toJSON(),
            isFollowed: loginUser?.Followings.some(f => f.id === user.id)
          }
        })
        res.render('user_followers', { observedUser: user.toJSON(), followers: result })
      })
      .catch(err => next(err))
  },
  followings: (req, res, next) => {
    const observedUserId = req.params.id
    const loginUser = getUser(req)

    return User.findByPk(observedUserId, {
      nest: true,
      include: [Tweet, { model: User, as: 'Followings' }]
    })
      .then(user => {
        const result = user.Followings.map(user => {
          return {
            ...user.toJSON(),
            isFollowed: loginUser?.Followings.some(f => f.id === user.id)
          }
        })
        res.render('user_followings', { observedUser: user.toJSON(), followings: result })
      })
      .catch(err => next(err))
  },

  settingPage: (req, res, next) => {
    const LoginUser = getUser(req)
    return res.render('user_setting', { LoginUser })
  },

  putSetting: async (req, res, next) => {
    try {
      const { newAccount, newName, newEmail, newPassword, newCheckPassword } = req.body
      const { id, account, email } = getUser(req)
      const loginUserId = id
      if (newPassword !== newCheckPassword) throw new Error('密碼與確認密碼不相符!')
      if (!newAccount || !newName || !newEmail || !newPassword || !newCheckPassword) {
        throw new Error('所有欄位為必填')
      }
      if (newAccount !== account) {
        const accountCheck = await User.findOne({ where: { account: newAccount } })
        if (accountCheck) throw new Error('account 已重複註冊！')
      }
      if (newEmail !== email) {
        const emailCheck = await User.findOne({ where: { email: newEmail } })
        if (emailCheck) throw new Error('email 已重複註冊！')
      }
      const operatedUser = await User.findByPk(loginUserId)
      await operatedUser.update({
        account: newAccount,
        name: newName,
        email: newEmail,
        password: await bcrypt.hash(newPassword, 10)
      })
      req.flash('success_messages', '資料更新成功！')
      res.redirect(`/users/${loginUserId}/setting`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
