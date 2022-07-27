const bcrypt = require('bcrypt-nodejs')
const { getUser } = require('../_helpers')
const jwt = require('jsonwebtoken')

const { User, Tweet, Like, Followship } = require('../models')

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
      res.redirect('/tweets')
      // const userData = req.user.toJSON()
      // delete userData.password
      // res.json({
      //   status: 'success',
      //   data: {
      //     user: userData
      //   }
      // })
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
  getUserFollowings: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [['Followings', 'created_at', 'DESC']]
      })
      user.Followings[0]
        ? res.json({ status: 'success', data: user.Followings })
        : res.json({ status: 'success', data: null })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [['Followers', 'created_at', 'DESC']]
      })
      user.Followers[0]
        ? res.json({ status: 'success', data: user.Followers })
        : res.json({ status: 'success', data: null })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const userTweets = await Tweet.findAll({
        where: { user_id: userId },
        raw: true
      })
      userTweets[0]
        ? res.json({ status: 'success', data: userTweets })
        : res.json({ status: 'success', data: null })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId, {
        include: [{ model: Like, include: Tweet }]
      })
      user.Likes[0]
        ? res.json({ status: 'success', data: user.Likes })
        : res.json({ status: 'success', data: null })
    } catch (err) {
      next(err)
    }
  },
  getUserProfile: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      if (req.user.id !== userId) {
        throw new Error("Can not edit other user's account!")
      }
      const existUser = await User.findByPk(userId, { raw: true })
      if (!existUser) throw new Error("Account didn't exist!")

      return res.render('settings', { existUser })

      // return res.json({ status: 'success', data: existUser })
    } catch (err) {
      next(err)
    }
  },
  postUserProfile: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      if (req.user.id !== userId) {
        throw new Error("Can not edit other user's account!")
      }
      let { account, name, email, password, passwordCheck } = req.body
      if (!account || !email || !password) {
        throw new Error('Please complete all required fields')
      }
      if (password !== passwordCheck) throw new Error('Passwords do not match!')
      const existAccount = await User.findOne({ where: { account } })
      if (existAccount && Number(existAccount.id) !== req.user.id) {
        throw new Error('Account already exists!')
      }
      const existEmail = await User.findOne({ where: { email } })
      if (existEmail && Number(existEmail.id) !== req.user.id) {
        throw new Error('Email already exists!')
      }
      name = name.trim()
      if (name.length > 50) {
        throw new Error("Name can't have too many characters.")
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const newUserData = { account, name, email, password: hash }
      const userData = await User.findByPk(userId)
      userData.update(newUserData)
      req.flash('success_messages', '帳號重新編輯成功，請重新登入！')
      return res.redirect('/')

      // delete newUserData.password
      // delete newUserData.passwordCheck
      // return res.json({ status: 'success', data: newUserData })
    } catch (err) {
      next(err)
    }
  },
  postFollow: async (req, res, next) => {
    try {
      const UserId = getUser(req).id
      const followingId = Number(req.body.id)
      if (UserId === followingId) {
        throw new Error("You can't follow yourself")
      }
      const user = await User.findByPk(followingId)
      if (!user) throw new Error("User didn't exist")
      if (user.role === 'admin') {
        throw new Error("You can't follow admin")
      }
      const isFollowed = await Followship.findOne({
        where: { followerId: UserId, followingId }
      })
      if (isFollowed) {
        throw new Error('You are already following this user')
      }
      const newFollowShip = await Followship.create({
        followerId: UserId,
        followingId
      })
      res.json({ status: 'success', newFollowShip })
    } catch (err) {
      next(err)
    }
  },
  postUnfollow: async (req, res, next) => {
    try {
      const UserId = getUser(req).id
      const followingId = Number(req.body.id)
      const user = await User.findByPk(followingId)
      if (!user) throw new Error("User didn't exist")
      const followship = await Followship.findOne({
        where: { followerId: UserId, followingId }
      })
      if (!followship) throw new Error("You haven't follow this user")
      const destroyedFollowship = await followship.destroy()
      res.json({ status: 'success', destroyedFollowship })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
