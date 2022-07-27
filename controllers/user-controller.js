const { User, Tweet, Reply, Followship } = require('../models')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼與密碼確認不相符!')
    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位為必填')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email }})
    ])
      .then(([account, email]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ account, name, email, password: hash, role: 'user' }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
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
    res.send('login')
    // res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  tweets: (req, res, next) => {
    const id = req.params.id
    Promise.all([
      User.findByPk(id),
      Tweet.findAll({ 
        where: { UserId: id },
        order: [['createdAt', 'desc']],
        raw: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, tweets, followship]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: user.Followings.some(u => u.id === data.followerId)
          }))
          .slice(0, 10)
        res.render('profile', { targetUser: targetUser.toJSON(), tweets, user, users })
      })
      .catch(err => next(err))
  },
  replies: (req, res) => {
    const id = req.params.id
    Promise.all([
      User.findOne({ where: { id } }),
      Reply.findAll({
        where: { UserId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, replies, followship]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: user.Followings.some(u => u.id === data.followerId)
          }))
          .slice(0, 10)
        res.render('profile', { targetUser: targetUser.toJSON(), replies, user, users })
      })
      .catch(err => next(err))
  },
  likes: (req, res, next) => {
    const id = req.params.id
    Promise.all([
      User.findOne({ where: { id } }),
      Like.findAll({
        where: { UserId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, likes, followship]) => {
        if (!targetUser) throw new Error("User didn't exist")
        const user = getUser(req)
        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: user.Followings.some(u => u.id === data.followerId)
          }))
          .slice(0, 10)
        res.render('profile', { targetUser: targetUser.toJSON(), likes, user, users })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
