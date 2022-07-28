const { User } = require('../../models')
const bcrypt = require('bcryptjs')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (req.user.role === ADMIN) {
      req.logout()
      req.flash('error_messages', '帳號不存在')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入')
    return res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 查看不符合的條件
    if (!account || !name || !email || !password || !checkPassword) throw new Error('請填寫每個欄位')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name.length > 50) throw new Error('名稱長度超出上限 50 字！')

    // 並確認 email 與 account 不能重複
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email 已經存在!')
        if (userAccount) throw new Error('Account 已經存在!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    const id = req.user.id

    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON()
        res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  editSetting: (req, res, next) => {
    const id = req.user.id
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email) throw new Error('帳號、名稱、Email 不可空白!')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name.length > 50) throw new Error('名稱長度超出上限 50 字！')

    Promise.all([
      User.findByPk(id),
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, userEmail, userAccount]) => {
        if (userAccount) {
          // 同帳號，id 卻不同，表示修改後的帳號撞名了
          if (userAccount.id !== user.id) {
            throw new Error('Account 已經存在!')
          }
        }
        if (userEmail) {
          if (userEmail.id !== user.id) {
            throw new Error('Email 已經存在!')
          }
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
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = userConroller
