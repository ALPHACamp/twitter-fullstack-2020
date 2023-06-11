const { Op } = require('sequelize') // 用「不等於」的條件查詢資料庫時需要用到的東西
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet } = db
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
  // 取得自己的帳戶設定頁面
  getSettingPage: (req, res, next) => {
    const userId = req.params.id
    // 檢查是不是自己本人
    if (Number(userId) !== helpers.getUser(req).id) throw new Error('Permission denied.')
    // 取得自己的帳戶資訊
    User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist.')
        const { account, name, email } = user
        res.render('setting', { account, name, email, userId })
      })
      .catch(err => next(err))
  },
  // 送出帳戶設定資訊
  putSetting: (req, res, next) => {
    const userId = req.params.id
    const { account, name, email, password, confirmPassword } = req.body
    const errors = []
    // 檢查是不是自己本人
    if (Number(userId) !== helpers.getUser(req).id) throw new Error('Permission denied.')
    // 檢查帳戶資訊是否正確 任一欄不得為空 密碼與確認密碼必須相同
    if (!account || !name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不一致。' })
    }
    if (errors.length) {
      return res.render('setting', {
        userId,
        errors,
        account,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 檢查帳戶資訊是否正確 資料庫中是否已經有非管理者使用了該 account 或 email
    return Promise.all([
      User.findOne({ where: { account, isAdmin: 0, id: { [Op.ne]: userId } } }), // 尋找該account、排除管理員、排除自己
      User.findOne({ where: { email, isAdmin: 0, id: { [Op.ne]: userId } } }) // 尋找該email、排除管理員、排除自己
    ])
      .then(([accountUser, emailUser]) => {
        if (emailUser) {
          errors.push({ message: '這個Email已被註冊。' })
        }
        if (accountUser) {
          errors.push({ message: '這個帳號已被註冊。' })
        }
        if (errors.length) {
          return res.render('setting', {
            userId,
            errors,
            account,
            name,
            email,
            password,
            confirmPassword
          })
        }
        // 取得自己的帳戶資訊 同時生成密碼
        return Promise.all([
          User.findByPk(userId),
          bcrypt.hash(password, 10)
        ])
          .then(([user, hash]) => {
            if (!user) throw new Error('User did not exist.')
            // 更新到資料庫
            return user.update({ account, name, email, password: hash })
          })
          .then(() => {
            req.flash('success_messages', '帳戶設定完成。')
            res.redirect(`/users/${userId}/setting`)
          })
          .catch(err => next(err))
      })
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
  }
}

module.exports = userController
