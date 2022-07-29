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
      const personal = await User.findByPk(Number(req.params.id), {
        raw: true
      })
      if (personal.id === user.id) {
        const tweets = await Tweet.findAll({
          where: {
            ...user ? { UserId: user.id } : {}
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
        const likedTweetsId = req.user?.likedTweets.map(tweet => tweet.id)
        const tweetsList = tweets.map(tweet => ({
          ...tweet,
          isLiked: likedTweetsId?.includes(tweet.id)
        }))
        return res.render('profile', { tweetsList, user })
      } else {
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
        const likedTweetsId = req.user?.likedTweets.map(tweet => tweet.id)
        const tweetsList = tweets.map(tweet => ({
          ...tweet,
          isLiked: likedTweetsId?.includes(tweet.id)
        }))
        return res.render('profile', { tweetsList, user, personal })
      }
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalFollowings: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: User,
        order: [
          ['created_at', 'DESC']
        ],
        raw: true,
        nest: true
      })
      return res.render('personfollow', { tweets, user })
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalFollowers: async (req, res, next) => {
    try {
      // const currentUser = helpers.getUser(req)
      // const UserId = helpers.getUser(req).id

      const targetUser = await User.findByPk(req.params.userid, {
        include: [
          Tweet,
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } }
        ]
        // order: [[sequelize.col('Followers.Followship.createdAt'), 'DESC']]
      })
      if (!targetUser) throw new Error("User doesn't exist!")
      const tweetsCounts = targetUser.Tweets.length
      const readyuser = targetUser.toJSON()
      readyuser.Followers.forEach(e => {
        e.isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
      })
      // console.log('result', result)
      return res.render('personfollow', {
        data: readyuser,
        tweetsCounts,
      })
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
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'likedTweets' }
        ]
      })
      if (personal.id === user.id) {
        const likedTweetsId = req.user?.likedTweets.map(tweet => tweet.id)
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
        const tweetsList = tweets.map(tweet => ({
          ...tweet,
          isLiked: true
        }))
        return res.render('profileLike', { tweetsList, user })
      } else {
        const likedTweetsId = personal?.likedTweets.map(tweet => tweet.id)
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
        const tweetsList = tweets.map(tweet => ({
          ...tweet,
          isLiked: true
        }))
        return res.render('profileLike', { tweetsList, user, personal })
      }
    }
    catch (err) {
      next(err)
    }
  },
  getPersonalReplies: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const personal = await User.findByPk(Number(req.params.id), {
        raw: true
      })
      if (personal.id === user.id) {
        const replies = await Reply.findAll({
          where: {
            ...user ? { UserId: user.id } : {}
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
        return res.render('profileReply', { replies, user })
      } else {
        const replies = await Reply.findAll({
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
        return res.render('profileReply', { replies, user, personal })
      }
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = userController
