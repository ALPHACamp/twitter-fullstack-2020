const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur')
const { User } = require('../models')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets') // 暫時使用
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword || !account) throw new Error('所有欄位都是必填。')
    if (password !== confirmPassword) throw new Error('密碼 或 帳號 不正確！')
    if (name.length > 50) throw new Error('名稱上限為50字！')

    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([findAccount, findEmail]) => {
        if (findEmail) throw new Error('email已被使用！')
        if (findAccount) throw new Error('密碼 或 帳號 不正確！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user',
        avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg',
        banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png'
      }))
      .then(() => {
        req.flash('success_messages', '帳號註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  getUsers: (req, res) => {
    return res.render('users')
  },
  getSetting: (req, res, next) => {
    const currentUserId = helpers.getUser(req) && helpers.getUser(req).id

    if (currentUserId !== Number(req.params.id)) {
      req.flash('error_messages', '只能改自己的資料！')
      return res.redirect(`/users/${currentUserId}/setting`)
    }

    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const { account, name, email, password, confirmPassword } = req.body

    if (!account || !name || !email || !password || !confirmPassword) throw new Error('所有欄位都是必填！')
    if (password !== confirmPassword) throw new Error('密碼與確認密碼不相符！')
    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      User.findByPk(currentUser.id),
      User.findOne({ where: { email }, raw: true }),
      User.findOne({ where: { account }, raw: true })
    ])
      .then(([user, findEmail, findAccount]) => {
        if (findAccount) {
          if (findAccount.id !== user.id) throw new Error('account 已重複註冊！')
        }

        if (findEmail) {
          if (findEmail.id !== user.id) throw new Error('email 已重複註冊！')
        }

        return bcrypt.hash(password, 10)
          .then(hash => {
            return user.update({
              account,
              name,
              email,
              password: hash
            })
          })
      })
      .then(() => {
        req.flash('success_messages', '個人資料修改成功！')
        return res.redirect('/tweets')
      })
      .catch(err => next(err))
  }

}
module.exports = userController
