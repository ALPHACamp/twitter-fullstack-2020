// 登入、註冊、登出、拿到編輯頁、送出編輯
const assert = require('assert')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號不存在！')
      req.logout()
      res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入！')
    res.status(302)
    res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!') // assert(req, 'Passwords do not match!')
    if (!account || !name || !email || !password || !checkPassword) throw new Error('Please fill in every blank.')
    if (name.length > 50) throw new Error('字數超出上限！')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('This account name has been used.')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        email,
        password: hash,
        name,
        avatar: "https://loremflickr.com/320/240/human",
        role: "user"
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: async (req, res, next) => {
    try {
      const user = await User.findByPk(Number(req.params.id), { raw: true })
      assert(user, '使用者不存在!')
      assert(user.id === helpers.getUser(req).id, '無法編輯他人資料!')
      return res.render('setting', user)
    }
    catch (err) {
      next(err)
    }
  },
  putSetting: async (req, res, next) => {
    try {
      const user = await User.findByPk(Number(req.params.id))
      const { account, name, email, password, checkPassword } = req.body
      const errors = []
      if (password !== checkPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
      }
      if (name?.length > 50 && account?.length > 50) {
        errors.push({ message: '字數超出上限！' })
      }
      const userEmail = await User.findOne({
        where: { ...email ? { email } : {} },
        raw: true
      })
      const userName = await User.findOne({
        where: { ...name ? { name } : {} },
        raw: true
      })
      const userAccount = await User.findOne({
        where: { ...account ? { account } : {} },
        raw: true
      })
      if (userEmail && userEmail.id !== user.id) {
        errors.push({ message: 'email 已重複註冊！' })
      }
      if (userAccount && userAccount.id !== user.id) {
        errors.push({ message: 'account 已重複註冊！' })
      }
      if (userName && userName.id !== user.id) {
        errors.push({ message: 'name 已重複註冊！' })
      }
      if (errors.length) {
        return res.render('setting', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }
      const hash = password ? await bcrypt.hash(password, 10) : ''
      const editedUser = await user.update({
        account,
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/tweets`)
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const likedTweetsId = req.user?.Likes.map(like => like.TweetId)
      const personal = await User.findByPk(Number(req.params.id), {
        include: [
          { model: Tweet }
        ]
      })
      const tweets = await Tweet.findAll({
        where: {
          ...personal ? { UserId: personal.id } : {}
        },
        include: [
          User
        ],
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC']
        ],
        raw: true,
        nest: true
      })
      for (let i in tweets) {
        const replies = await Reply.findAndCountAll({ where: { TweetId: tweets[i].id } })
        const likes = await Like.findAndCountAll({ where: { TweetId: tweets[i].id } })
        tweets[i].repliedCounts = replies.count
        tweets[i].likedCounts = likes.count
        tweets[i].isLiked = likedTweetsId?.includes(tweets[i].id)
      }
      const followingsId = user?.Followings?.map(f => f.id)
      user.isFollowed = (followingsId.includes(personal.id))
      return res.render('profile', { tweets, user, personal: personal.toJSON() })
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalFollowings: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const personal = await User.findByPk(Number(req.params.id), {
        include: [
          { model: User, as: 'Followings' },
          { model: Tweet }
        ]
      })
      return res.render('followings', { personal: personal.toJSON(), user })
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalFollowers: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const personal = await User.findByPk(Number(req.params.id), {
        include: [
          { model: User, as: 'Followers' },
          { model: Tweet }
        ]
      })
      return res.render('followers', { personal: personal.toJSON(), user })
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalLikes: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const personal = await User.findByPk(Number(req.params.id), {
        include: [
          { model: Tweet },
          { model: Like, as: Tweet }
        ]
      })
      const likedTweetsId = personal?.Likes.map(like => like.TweetId)
      const tweets = await Tweet.findAll({
        where: {
          ...likedTweetsId ? { id: likedTweetsId } : {}
        },
        include: [
          User
        ],
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC']
        ],
        raw: true,
        nest: true
      })
      for (let i in tweets) {
        const replies = await Reply.findAndCountAll({ where: { TweetId: tweets[i].id } })
        const likes = await Like.findAndCountAll({ where: { TweetId: tweets[i].id } })
        tweets[i].repliedCounts = replies.count
        tweets[i].likedCounts = likes.count
        tweets[i].isLiked = likedTweetsId?.includes(tweets[i].id)
      }
      const followingsId = user?.Followings?.map(f => f.id)
      user.isFollowed = (followingsId.includes(personal.id))
      return res.render('profile-like', { tweets, user, personal: personal.toJSON() })
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalReplies: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const personal = await User.findByPk(Number(req.params.id), {
        include: [
          { model: Tweet },
        ]
      })
      const replies = await Reply.findAll({
        where: {
          ...personal ? { UserId: personal.id } : {}
        },
        include: [
          User,
          { model: Tweet },
          { model: Tweet, include: User }
        ],
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC']
        ],
        raw: true,
        nest: true
      })
      const followingsId = user?.Followings?.map(f => f.id)
      user.isFollowed = (followingsId.includes(personal.id))
      return res.render('profile-reply', { replies, user, personal: personal.toJSON() })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = userController
