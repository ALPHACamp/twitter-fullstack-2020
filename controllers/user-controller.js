// 登入、註冊、登出、拿到編輯頁、送出編輯
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號不存在！')
      req.logout()
      res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.status(302)
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!') // assert(req, 'Passwords do not match!')
    if (!account || !name || !email || !password || !checkPassword) throw new Error('Please fill in every blank.')
    if (name.length > 50) throw new Error('字數超出上限！')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('This account name has been used.')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        email,
        password: hash,
        name,
        avatar: "https://loremflickr.com/320/240/human",
        role: "user"
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    const id = Number(req.params.id)
    console.log('here is getSetting', id)
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        if (user.id !== req.user.id) throw new Error('無法編輯他人資料!')
        user = user.toJSON()
        res.render('setting', { user })
      }).catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const id = req.params.id
    const { file } = req
    const { account, name, email, password, checkPassword } = req.body
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    if (!account || !name || !email || !password || !checkPassword) throw new Error('Please fill in every blank.')
    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, filePath, userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('This account name has been used.')
        return user.update({
          account,
          name,
          email,
          password,
          checkPassword,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/tweets`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
