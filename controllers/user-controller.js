const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Followship } = db
const helpers = require('../_helpers')

const userController = {
  // 取得註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 送出註冊資訊
  signUp: (req, res, next) => {
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
      return res.render('signup', {
        errors,
        account,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 檢查註冊資訊是否正確 前往資料庫查詢 非管理員的 account 或 email 是否已存在於資料庫
    return Promise.all([
      User.findOne({ where: { account, isAdmin: 0 } }),
      User.findOne({ where: { email, isAdmin: 0 } })
    ])
      .then(([accountUser, emailUser]) => {
        if (emailUser) {
          errors.push({ message: '這個Email已被註冊。' })
        }
        if (accountUser) {
          errors.push({ message: '這個帳號已被註冊。' })
        }
        if (errors.length) {
          return res.render('signup', {
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
            res.redirect('/signin')
          })
          .catch(err => next(err))
      })
  },
  // 取得登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 送出登入資訊
  signIn: (req, res) => {
    res.redirect('/tweets')
  },
  // 登出
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '你已成功登出。')
    res.redirect('/signin')
  },
  // API: 取得目前登入的使用者資料 只回傳json (待刪除取得的password)
  getUserData: (req, res, next) => {
    User.findByPk(helpers.getUser(req).id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  // API: 送出編輯個人資料資訊
  editUserProfile: (req, res, next) => {
    const { name, intro } = req.body
    // 驗證name是否有值
    if (!name || name.trim() === '') throw new Error('Name is required.')
    // 去資料庫找user並更新資料
    User.findByPk(helpers.getUser(req).id)
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return user.update({ name, intro: intro || user.intro })
      })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  // 取得特定使用者頁面
  getUserPage: (req, res, next) => {
    const userId = req.params.id
    Promise.all([
      // 取得特定使用者 Id
      User.findByPk(userId, {
        raw: true,
        nest: true
      }),
      // 取得該使用者所有貼文
      Tweet.findAll({
        where: { UserId: userId },
        include: [User],
        raw: true,
        nest: true
      }),
      // 取得目前登入的使用者資料
      User.findByPk(helpers.getUser(req).id, { raw: true })
    ])
      .then(([user, tweets, currentUser]) => {
        console.log(tweets)
        res.render('user', { user, tweets, currentUser })
      })
  },

  // 追蹤特定使用者
  addFollow: (req, res, next) => {
    // 按鈕上這人的 id
    const userId = Number(req.body.id)
    // 登入中的使用者 id
    const loginUser = helpers.getUser(req).id

    // 自己不能追蹤自己(測試檔 redirect 需要 200)
    if (userId === loginUser.id) {
      req.flash('error_messages', 'Cannot follow yourself!')
      return res.redirect(200, 'back')
    }

    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followingId: loginUser,
          followerId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('User did not exist.')
        if (followship) throw new Error('You have already followed this user!')
        return Followship.create({
          followerId: loginUser,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  // 取消追蹤特定使用者
  removeFollow: (req, res, next) => {
    // 按鈕上這人的 id
    const userId = req.params.id
    // 登入中的使用者 id
    const loginUser = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followerId: loginUser,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
