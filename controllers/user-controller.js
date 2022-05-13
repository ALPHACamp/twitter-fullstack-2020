const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { removeAllSpace, removeOuterSpace } = require('../_helpers')
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

      if (!account || !email || !password) {
        errors.push({ message: '請確認必填欄位' })
      }

      const existAccount = await User.findOne({ where: { account } })
      if (existAccount) errors.push({ message: '帳號已被註冊' })

      const existEmail = await User.findOne({ where: { email } })
      if (existEmail) errors.push({ message: '信箱已被註冊' })

      if (password !== checkPassword) errors.push({ message: '密碼輸入不相同' })

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (name.length > 50) errors.push({ message: '名稱長度限制50字元以內' })
      if (!name) name = account

      if (errors.length) {
        return res.render('signup', { errors, account, name, email })
      }

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
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, tweets, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Tweet.findAll({
          include: [
            Reply,
            {
              model: User,
              as: 'LikedUsers'
            }
          ],
          where: { userId },
          order: [['createdAt', 'DESC']]
        }),
        User.findAll({
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          attributes: [
            'id',
            'name',
            'account',
            [
              sequelize.fn('COUNT', sequelize.col('followerId')),
              'followerCounts'
            ]
          ],
          group: 'followingId',
          order: [[sequelize.col('followerCounts'), 'DESC']]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      tweets.forEach(function (tweet, index) {
        this[index] = { ...tweet.toJSON() }
      }, tweets)

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      const followshipData = followships
        .map(user => ({
          ...user.toJSON(),
          isFollowed: followingUserId.includes(user.id)
        }))
        .slice(0, 10)

      res.render('user', {
        user: user.toJSON(),
        tweets,
        followships: followshipData,
        tab: 'getTweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, replies, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Reply.findAll({
          where: { userId },
          include: [{ model: Tweet, include: User }],
          order: [['createdAt', 'DESC']]
        }),
        User.findAll({
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          attributes: [
            'id',
            'name',
            'account',
            [
              sequelize.fn('COUNT', sequelize.col('followerId')),
              'followerCounts'
            ]
          ],
          group: 'followingId',
          order: [[sequelize.col('followerCounts'), 'DESC']]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      replies.forEach(function (reply, index) {
        this[index] = { ...reply.toJSON() }
      }, replies)

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      const followshipData = followships
        .map(user => ({
          ...user.toJSON(),
          isFollowed: followingUserId.includes(user.id)
        }))
        .slice(0, 10)

      res.render('user', {
        user: user.toJSON(),
        replies,
        followships: followshipData,
        tab: 'getReplies'
      })
    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' },
            {
              model: Tweet,
              as: 'LikedTweets',
              include: [User, Reply, { model: User, as: 'LikedUsers' }]
            }
          ]
        }),
        User.findAll({
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          attributes: [
            'id',
            'name',
            'account',
            [
              sequelize.fn('COUNT', sequelize.col('followerId')),
              'followerCounts'
            ]
          ],
          group: 'followingId',
          order: [[sequelize.col('followerCounts'), 'DESC']]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      const followshipData = followships
        .map(user => ({
          ...user.toJSON(),
          isFollowed: followingUserId.includes(user.id)
        }))
        .slice(0, 10)

      res.render('user', {
        user: user.toJSON(),
        followships: followshipData,
        tab: 'getLikedTweets'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        User.findAll({
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          attributes: [
            'id',
            'name',
            'account',
            [
              sequelize.fn('COUNT', sequelize.col('followerId')),
              'followerCounts'
            ]
          ],
          group: 'followingId',
          order: [[sequelize.col('followerCounts'), 'DESC']]
        })
      ])

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      data.Followers.forEach(
        user => (user.isFollowed = followingUserId.includes(user.id))
      )

      const followshipData = followships
        .map(user => ({
          ...user.toJSON(),
          isFollowed: followingUserId.includes(user.id)
        }))
        .slice(0, 10)

      res.render('followship', {
        user: data,
        followships: followshipData,
        tab: 'getFollowers'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, followships] = await Promise.all([
        User.findByPk(userId, {
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        User.findAll({
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          attributes: [
            'id',
            'name',
            'account',
            [
              sequelize.fn('COUNT', sequelize.col('followerId')),
              'followerCounts'
            ]
          ],
          group: 'followingId',
          order: [[sequelize.col('followerCounts'), 'DESC']]
        })
      ])

      const data = user.toJSON()
      const followingUserId = data.Followings.map(user => user.id)

      data.Followers.forEach(
        user => (user.isFollowed = followingUserId.includes(user.id))
      )

      const followshipData = followships
        .map(user => ({
          ...user.toJSON(),
          isFollowed: followingUserId.includes(user.id)
        }))
        .slice(0, 10)

      res.render('followship', {
        user: data,
        followships: followshipData,
        tab: 'getFollowings'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
