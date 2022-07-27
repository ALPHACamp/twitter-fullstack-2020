const { User } = require('../../models')
const bcrypt = require('bcryptjs')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
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
  }
}

module.exports = userConroller
