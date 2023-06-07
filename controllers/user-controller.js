const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  // 取得註冊頁面
  registPage: (req, res) => {
    res.render('regist')
  },
  // 送出註冊資訊
  regist: (req, res, next) => {
    // 取出註冊資訊
    const { account, name, email, password, confirmPassword } = req.body
    // 準備裝錯誤訊息的陣列 為了同時顯示多個錯誤
    const errors = []

    // 檢查註冊資訊是否正確 任一欄不得為空 密碼與確認密碼必須相同
    if (!account || !name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不一致。' })
    }
    if (errors.length) {
      return res.render('regist', {
        errors,
        account,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 檢查註冊資訊是否正確 account 或 email 是否已存在於資料庫
    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([accountUser, emailUser]) => {
        if (emailUser) {
          errors.push({ message: '這個Email已被註冊。' })
        }
        if (accountUser) {
          errors.push({ message: '這個帳號已被註冊。' })
        }
        if (errors.length) {
          return res.render('regist', {
            errors,
            account,
            name,
            email,
            password,
            confirmPassword
          })
        }
        return bcrypt.hash(password, 10)
          // 在資料庫創建User資料
          .then(hash => User.create({
            account,
            name,
            email,
            password: hash
          }))
          .then(() => {
            req.flash('success_messages', '成功註冊帳號。')
            res.redirect('/login')
          })
          .catch(err => next(err))
      })
  },
  // 取得登入頁面
  loginPage: (req, res) => {
    res.render('login')
  },
  // 送出登入資訊
  login: (req, res) => {
    res.redirect('/main')
  },
  // 登出
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '你已成功登出。')
    res.redirect('/login')
  }
}

module.exports = userController
