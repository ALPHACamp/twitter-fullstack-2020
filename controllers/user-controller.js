const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    if (password !== checkPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    const errorsMsg = {
      errors,
      account,
      name,
      email,
      password,
      checkPassword
    }
    if (errors.length) {
      return res.render('signup', errorsMsg)
    }
    Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email } })])
      .then(([account, email]) => {
        if (account) {
          errors.push({ message: 'account 已重複註冊！' })
        }
        if (email) {
          errors.push({ message: 'email 已重複註冊！' })
        }
        if (errors.length) {
          res.render('signup', errorsMsg)
          return null
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        if (hash) {
          console.log('hash')
          return User.create({ account, name, email, password: hash, role: 'user' })
        }
      })
      .then(user => {
        if (user) {
          console.log('user')
          req.flash('success_messages', '成功註冊帳號！')
          res.redirect('/signin')
        }
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
      })
    ])
      .then(([targetUser, tweets]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        const tweetsData = tweets
          .map(t => ({
            ...t.toJSON(),
            likedCount: t.Likes.length,
            repliedCount: t.Replies.length,
            isLiked: t.Likes.some(like => like.UserId === user.id)
          }))
        res.locals.tweetsLength = tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), tweets: tweetsData, user, tweet: true })
      })
      .catch(err => next(err))
  },
  replies: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
      }),
      Reply.findAll({
        where: { UserId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      })
    ])
      .then(([targetUser, replies]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), replies, user, reply: true })
      })
      .catch(err => next(err))
  },
  likes: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
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
      })
    ])
      .then(([targetUser, likes]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        const likesData = likes
          .map(l => ({
            ...l.toJSON(),
            likedCount: l.Tweet.Likes.length,
            repliedCount: l.Tweet.Replies.length,
            isLiked: user ? l.Tweet.Likes.some(like => like.UserId === user.id) : false
          }))
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('profile', { targetUser: targetUser.toJSON(), likes: likesData, user, like: true })
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
        }).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
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
        }).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
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
