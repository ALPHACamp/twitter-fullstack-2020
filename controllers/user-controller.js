const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { imgurFileHandler } = require('../_helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const errors = []
      let { account, name, email, password, checkPassword } = req.body
      if (!account || !email || !password) errors.push({ message: '請確認必填欄位' })
      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) errors.push({ message: '帳號已被註冊' })
      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) errors.push({ message: '信箱已被註冊' })
      if (password !== checkPassword) errors.push({ message: '密碼輸入不相同' })
      if (errors.length) return res.render('signup', { errors, account, name, email })
      name = cleanStr(name)
      if (cleanStr(name) === '') { name = account }
      const hash = bcrypt.hashSync('12345678', bcrypt.genSaltSync(10))
      await User.create({ account, name, email, password: hash })
      req.flash('success_messages', '您已成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: async (req, res, next) => {
    try {
      res.render('signin')
    } catch (err) {
      next(err)
    }
  }
}

const cleanStr = str => {
  let newStr = ''
  newStr = str.trim()
  newStr = str.replace(/\s/g, '')
  return newStr
}

module.exports = userController
