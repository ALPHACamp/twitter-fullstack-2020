const bcrypt = require('bcryptjs')
const { Followship, Like, Reply, Tweet, User } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const userController = {
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
        throw new Error('所有資料都是必填!')
      } else if (name.length >= 50) {
        throw new Error('姓名不得超過50字!')
      } else if (password !== checkPassword) {
        throw new Error('密碼和確認密碼不一致!')
      } else {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) throw new Error('account 已重複註冊！')
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) throw new Error('email 已重複註冊！')
        await User.create({
          account,
          name,
          email,
          password: hash
        })
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      }
    } catch (err) { next(err) }
  },
  signInPage: (req, res, next) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    return User.findByPk(helpers.getUser(req).id)
      .then(currentUser => {
        currentUser = currentUser.toJSON()
        const { account, name, email } = currentUser
        return res.render('settings', { account, name, email })
      })
  },
  putSetting: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('所有資料都是必填!')
      } else if (name.length >= 50) {
        throw new Error('姓名不得超過50字!')
      } else if (password !== checkPassword) {
        throw new Error('密碼和確認密碼不一致!')
      }
      const theUser = helpers.getUser(req)
      const userAccount = await User.findOne({
        where: {
          [Op.and]: [
            { account },
            { account: { [Op.notLike]: theUser.account } }
          ]
        }
      })
      if (userAccount) throw new Error('account 已重複註冊！')
      const userEmail = await User.findOne({
        where: {
          [Op.and]: [
            { email },
            { email: { [Op.notLike]: theUser.email } }
          ]
        }
      })
      if (userEmail) throw new Error('email 已重複註冊！')
      const user = await User.findByPk(theUser.id)
      await user.update({
        account,
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功修改帳戶設定！')
      res.redirect('/tweets')
    } catch (err) { next(err) }
  },
  getUserTweets: (req, res, next) => {

  },
  getUserReplies: (req, res, next) => {
  },
  getUserLikes: (req, res, next) => {
  },
  getUserFollowings: (req, res, next) => {
  },
  getUserFollowers: (req, res, next) => {
  },
  putProfile: (req, res, next) => {
  }
}

module.exports = userController
