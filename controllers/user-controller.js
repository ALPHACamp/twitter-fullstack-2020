const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Followship, Like, Tweet } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆為必填')
      }

      const findUser = await User.findOne({
        where: { [Op.or]: [{ account }, { email }] }, // Op.or: 表示接下來陣列內的條件之一成立即可
        attributes: ['account', 'email'] // 若有找到，只返回 account 和 email 屬性即可
      })

      if (findUser && findUser.account === account) {
        errors.push('此帳號已被註冊')
      }
      if (name.length > 50) {
        errors.push('名稱不能超過 50 個字')
      }
      if (findUser && findUser.email === email) {
        errors.push('此 Email 已被註冊')
      }
      if (password !== checkPassword) {
        errors.push('兩次輸入的密碼不相同')
      }
      if (errors.length > 0) {
        throw new Error(errors.join('\n & \n'))
      }

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ account, name, email, password: hash })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getOther: (req, res) => {
    res.render('other-tweets')
  },
  //* 追蹤功能
  addFollowing: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user) throw new Error('找不到該用戶')
      return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user) throw new Error('找不到該用戶')
      const followShip = await Followship.findOne({
        where: { followerId: req.user.id, followingId: req.params.userId }
      })
      if (!followShip) throw new Error('還沒有追蹤用戶')
      await followShip.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  //* Like tweet
  addLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.user.id)
      if (!tweet) throw new Error('找不到該篇推文')
      await Like.create({ tweetId: req.params.id, userId: req.user.id })
      return res.render('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { userId: req.user.id, tweetId: req.params.id }
      })
      like.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
