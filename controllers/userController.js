const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const db = require('../models')
const { sequelize } = db
const { Op } = db.Sequelize
const { User, Tweet, Reply, Like, Followship } = db

const userController = {
  getUser: async (req, res) => {
    const user = await User.findByPk(helpers.getUser(req).id, {
      attributes: { exclude: ['password'] },
      raw: true
    })
    return user
  },

  getUserTweets: async (req, res) => {
    try {
      const queryId = Number(req.params.userId)

      const tweets = await Tweet.findAll({
        where: { UserId: queryId },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = Tweet.id)'), 'likeCount'],
        ],
        order: [['createdAt', 'DESC']]
      })

      const user = await User.findByPk(queryId, {
        attributes: [
          'id',
          'name',
          'account',
          'avatar'
        ]
      })

      return res.json({ tweets, user })
    } catch (err) {
      console.error(err)
    }
  },

  getUserReplies: async (req, res) => {
    try {
      const queryId = Number(req.params.userId)

      const replies = await Reply.findAll({
        where: { UserId: queryId },
        attributes: [
          'comment',
          'createdAt'
        ],
        // 不熟 sequelize 待優化
        include: [
          { model: Tweet, attributes: ['UserId'], include: [{ model: User, attributes: ['account'] }] }
        ],
        order: [['createdAt', 'DESC']]
      })

      const user = await User.findByPk(queryId, {
        attributes: [
          'id',
          'name',
          'account',
          'avatar'
        ]
      })

      return res.json({ replies, user })
    } catch (err) {
      console.error(err)
    }
  },

  getUserLikes: async (req, res) => {
    try {
      const queryId = Number(req.params.userId)

      const tweets = await Tweet.findAll({
        where: { UserId: queryId },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = Tweet.id)'), 'likeCount'],
          // [sequelize.literal(`(SELECT UserId FROM likes WHERE likes.TweetId = Tweet.id AND likes.UserId = ${queryId})`), 'isLike']
        ],
        include: [{ model: Like }],
        order: [['createdAt', 'DESC']]
      })

      return res.json({ tweets })

    } catch (err) {
      console.error(err)
    }
  },

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (checkPassword !== password) {
        errors.push({ message: '兩次密碼輸入不同！' })
      }

      const user1Promise = User.findOne({ where: { account } })
      const user2Promise = User.findOne({ where: { email } })
      const [user1, user2] = await Promise.all([user1Promise, user2Promise])

      if (user1) {
        errors.push({ message: '帳號已重複！' })
      }

      if (user2) {
        errors.push({ message: 'Email 已重複重複！' })
      }

      if (errors.length) {
        return res.render('signup', { errors, ...req.body })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  },

  signInPage: (req, res) => {
    const isBackend = req.originalUrl.includes('admin')
    return res.render('signin', { isBackend })
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')

    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return res.redirect('/tweets')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    
    if (helpers.getUser(req).role === 'admin') {
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.logout()
    return res.redirect('/signin')
  },

  editUserPage: async (req, res) => {
    try {
      const userId = req.params.userId

      if (req.user.id !== Number(userId)) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('/tweets')
      }

      return res.render('edit')
    } catch (err) {
      console.error(err)
    }
  },

  putUser: async (req, res) => {
    try {
      const userId = req.params.userId

      if (req.user.id !== Number(userId)) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('/tweets')
      }

      let user = await User.findByPk(userId)
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (checkPassword !== password) {
        errors.push({ message: '兩次密碼輸入不同！' })
      }

      const user1Promise = User.findOne({ where: { account, [Op.not]: { id: userId } } })
      const user2Promise = User.findOne({ where: { email, [Op.not]: { id: userId } } })
      const [user1, user2] = await Promise.all([user1Promise, user2Promise])

      if (user1) {
        errors.push({ message: '帳號已重複！' })
      }

      if (user2) {
        errors.push({ message: 'Email 已重複重複！' })
      }

      if (errors.length) {
        return res.render('signup', { errors, ...req.body })
      }

      user = await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '成功編輯帳號！')
      return res.render('edit', { user: user.toJSON() })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
