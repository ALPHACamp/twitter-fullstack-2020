const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    const errorsMsg = { errors, account, name, email, password, checkPassword }

    if (password !== checkPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱上限為50字' })
    }

    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
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
          return User.create({ account, name, email, password: hash, role: 'user' })
        }
      })
      .then(user => {
        if (user) {
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
  getOtherPage: (req, res) => {
    res.render('other')
  },
  getSetting: (req, res) => {
    res.render('setting')
  },
  getReply: (req, res) => {
    res.render('modals/reply')
  },
  getUser: (req, res, next) => {
    User.findByPk(getUser(req).id)
      .then(userData => {
        if (!userData) throw new Error("user didn't exist")

        const user = userData.toJSON()
        delete user.password // 新增這裡，刪除密碼(移除敏感資料)
        res.json({ status: 'success', ...user })
      })
      .catch(err => next(err))
  },
  postUser: async (req, res, next) => {
    const { file } = req // 把檔案取出來
    const { name, introduction } = req.body

    const user = await User.findByPk(getUser(req).id)
    if (!user) throw new Error("user didn't exist")
    let avatarFilePath = user.dataValues.avatar
    let coverFilePath = user.dataValues.cover

    // 檢查符號 ?. 前面這個 object 值存不存在
    if (file?.image) {
      avatarFilePath = await imgurFileHandler(...file.image)
    }

    if (file?.coverImage) {
      coverFilePath = await imgurFileHandler(...file.coverImage)
    }

    await user.update({ name, introduction, avatar: avatarFilePath, cover: coverFilePath })
      .then(() => {
        req.flash('success_messages', '個人資料已更新')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
