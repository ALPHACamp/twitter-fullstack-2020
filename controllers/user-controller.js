const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

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
      let { account, name, email, password, passwordCheck } = req.body
      if (!account || !email || !password) {
        throw new Error('Please complete all required fields')
      }
      if (password !== passwordCheck) throw new Error('Passwords do not match!')
      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) throw new Error('Account already exists!')
      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) throw new Error('Email already exists!')
      name = name.trim()
      if (name.length > 50) {
        throw new Error("Name can't have too many characters.")
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const userData = { account, name, email, password: hash }
      await User.create(userData)
      req.flash('success_messages', '您已成功註冊帳號！')
      // return res.render('signin')

      delete userData.password
      return res.json(userData)
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
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      // res.redirect('/tweets')
      const userData = req.user.toJSON()
      delete userData.password
      res.json({
        status: 'success',
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登出！')
      req.logout()
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserFollowers: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserTweets: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserLikes: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserProfile: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postUserProfile: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postFollow: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postUnfollow: (req, res, next) => {
    res.json({ status: 'success' })
  }
}

module.exports = userController
