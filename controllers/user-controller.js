const { Tweet, User } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

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
      User.findOne({ where: { email }})
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
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  followers: (req, res, next) => {
    const observedUserId = req.params.id
    const loginUser = helpers.getUser(req)

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
  }
}

module.exports = userController
