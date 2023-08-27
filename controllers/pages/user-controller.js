const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

const _helper = require('../../_helpers')
const { User } = require('../../models')

const userController = {
  /* admin 登入 */
  adminSignin: (req, res, next) => {
    try {
      return res.redirect('/admin')
    } catch (error) {
      return next(error)
    }
  },
  getAdminSignInPage: (req, res, next) => {
    try {
      if (_helper.ensureAuthenticated(req)) return res.redirect('/admin')
      return res.render('admin/signin')
    } catch (error) {
      return next(error)
    }
  },

  // 以下兩個logout重複需要合併優化
  adminLogout: (req, res, next) => {
    try {
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/admin/signin', { role: 'admin' })
      }
      next()
    } catch (error) {
      return next(error)
    }
  },
  /* admin登入結束 */
  /* user登入 */

  getUserSignInPage: (req, res, next) => {
    try {
      if (_helper.ensureAuthenticated(req)) return res.redirect('/tweets') // 如果已經有user就轉去root
      return res.render('login/signin')
    } catch (error) {
      return next(error)
    }
  },
  userSignIn: (req, res, next) => {
    try {
      return res.redirect('/tweets')
    } catch (error) {
      return next(error)
    }
  },
  getUserSignUpPage: (req, res, next) => {
    try {
      return res.render('login/signup')
    } catch (error) {
      return next(error)
    }
  },
  userSignUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []

    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ messages: '所有欄位皆為必填' })
    }

    if (name.length > 50) {
      errors.push({ messages: '暱稱不得超過50字' })
    }

    if (password !== checkPassword) {
      errors.push({ messages: '密碼與確認密碼不相符!' })
    }

    if (errors.length) {
      return res.render('login/signup', {
        errors,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }

    try {
      const isAccountExist = await User.findOne({ where: { account } })
      const isEmailExist = await User.findOne({ where: { email } })

      if (isAccountExist) {
        errors.push({ messages: 'account 已重複註冊！' })
      }

      if (isEmailExist) {
        errors.push({ messages: 'email 已重複註冊！' })
      }

      if (errors.length) {
        return res.render('login/signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash
      })

      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },
  userLogout: (req, res, next) => {
    try {
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/signin')
      }
      next()
    } catch (error) {
      return next(error)
    }
  }
  /* user登入結束 */
}

module.exports = userController
