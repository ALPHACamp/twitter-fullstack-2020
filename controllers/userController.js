const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []

    if (password !== passwordCheck) {
      error.push({ message: '密碼與確認密碼必須相同' })
      return res.render('signup', { account, name, email, errorMessage })
    }

    User.findOne({ where: { $or: [{ email }, { account }] }, raw: true })
      .then(user => {
        if (user) {
          if (user.email === email) { error.push({ message: 'Email已被註冊' }) }
          if (user.account === account) { error.push({ message: '帳號已被使用' }) }
          return res.render('signup', { account, email, name, error })
        }
        if (!user) {
          return User.create({ account, name, email, password: hashPassword })
            .then(() => {
              req.flash('successMessage')
              res.redirect('signin')
            })
        }
      })
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('successMessage', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //該名使用者的所有推文
  getTweets: (req, res) => {
    Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        Reply,
        { model: User, as: 'likedUsers' },
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      res.render('user-tweets', { tweets })
    })
  },
  //該名使用者的所有喜歡內容
  getLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Reply,
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
      ]
    })
      .then(user => {
        console.log(user.toJSON())
        res.render('user-likes', { user: user.toJSON() })
      })
  },
  //該名使用者的所有回覆內容
  getReplies: (req, res) => res.render('user-replies'),
  editUser: (req, res) => res.render('setting'),
  putUser: (req, res) => {
    const id = Number(req.params.id)
    const userId = req.user.id
    if (userId !== id) {
      req.flash('errorMessage', 'error')
      res.redirect('/tweets')
    }
    const { name, avtar, cover, introduction } = req.body
    return User.findByPk(id)
      .then(user => {
      })
      .then(() => res.redirect('/tweets'))
  }
}

module.exports = userController