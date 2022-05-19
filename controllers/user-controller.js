const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, sequelize} = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Op } = require("sequelize")
const { catchTopUsers } = require('../helpers/sequelize-helper')
const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號不存在')
      req.logout()
      res.redirect('/signin')
    }
    req.flash('success_messages', '登入成功!')
    res.redirect('/tweets')

  },
  signUpPage: (req, res) => {
    res.render('register')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Password do not match!')
    Promise.all([User.findOne({ where: { email: req.body.email } }), User.findOne({ where: { account: req.body.account } })])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getSetting: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        if (user.id !== req.user.id) throw new Error("Can't get other's profile")
        user = user.toJSON()
        res.render('profile', { user })
      }).catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const id = Number(req.params.id)
    const { account, name, email, password, passwordCheck } = req.body
    if (!account) throw new Error('User account is required!')
    if (!password) throw new Error('User password is required!')
    if (password !== passwordCheck) throw new Error('Please confirm the password')
    Promise.all([
      User.findByPk(id),
      User.findByPk(account),
      User.findByPk(email)
    ])
      .then(([userId, userAccount, userEmail]) => {
        if (req.user.id !== id) throw new Error("Cannot edit other's profile")
        if (!userId) throw new Error("User doesn't exist!")
        if (userAccount) throw new Error("Account already exist!")
        if (userEmail) throw new Error("Email already exist!")
        return bcrypt.hash(req.body.password, 10)
          .then(hash => {
            return userId.update({
              account,
              name,
              email,
              password: hash
            })
          })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/')
      })
      .catch(err => next(err))
  },
  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const currentUser = helpers.getUser(req)
      const [user,topUsers] = await Promise.all([ 
        User.findByPk(UserId, {
          include: [
            { model: Tweet, include: [Reply, Like, User]},
            { model: Reply, include: { model: Tweet, include: [User] } },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' }
          ]
        })
        ,catchTopUsers(req)
      ])
      const data = user.Tweets.map(e => ({
        ...e.toJSON(),
        totalLike: e.Likes.length,
        totalReply: e.Replies.length,
        isLiked: e.Likes.some(f => f.UserId === helpers.getUser(req).id)
      })).reverse()
      if (!user) throw new Error("User didn't exists!")
      const followersCount = user.Followers.length
      const followingsCount = user.Followings.length
      const tweetsCount = user.Tweets.length

      res.render('user', {
        
        user: user.toJSON(),
        topUsers,
        tweets: data,
        followersCount,
        followingsCount,
        tweetsCount,
        currentUser
      })

    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const [user, topUsers] = await Promise.all([ 
        User.findByPk(UserId, {
          include: [
            { model: Like, include: [{ model: Tweet, include: [User, Like, Reply] }] },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' }
          ]
        })
        ,catchTopUsers(req)
      ])
      const followersCount = user.Followers.length
      const followingsCount = user.Followings.length
      const data = user.Likes.map(e => {
        const f = {...e.toJSON()}
        f.Tweet.totalLike= f.Tweet.Likes.length,
        f.Tweet.totalReply= f.Tweet.Replies.length,
        f.Tweet.isLiked= f.Tweet.Likes.some(g => g.UserId === helpers.getUser(req).id)
        return f
      }).reverse()
      if (!user) throw new Error("User didn't exists!")
      return res.render('user', {
        user: user.toJSON(),
        likes: data,
        topUsers,
        followersCount,
        followingsCount
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const [user,topUsers] = await Promise.all ([
        User.findByPk(UserId, {
          include: [
            { model: Reply, include: [{ model: Tweet, include: [User] }] },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' }
          ],
        })
        ,catchTopUsers(req)
      ])
      const followersCount = user.Followers.length
      const followingsCount = user.Followings.length
      const userReplies = user.Replies

      if (!user) throw new Error("User didn't exists!")
      return res.render('user', {
        user: user.toJSON(),
        userReplies,
        topUsers,
        followersCount,
        followingsCount
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const [data,topUsers ] = await Promise.all([ 
        User.findByPk(UserId, {
          include: [
            Tweet,
            { model: User, as: 'Followers', include:{model: User,as:'Followers'}},
          ],
          order: [['createdAt', 'DESC']]
        })
        ,catchTopUsers(req)
      ])
      const tweetsCounts = data.Tweets.length
      let followers = 'followers'
      if (!data) throw new Error("User didn't exists!")
      const user = data.toJSON()
      user.Followers.forEach(e=>{
        e.isFollowed = e.Followers.some(f=>f.id===helpers.getUser(req).id)
      })
      user.Followers=user.Followers.reverse()
      return res.render('followers', {
        data: user,
        topUsers,
        tweetsCounts,
        followers
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const [data,topUsers] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            Tweet,
            { model: User, as: 'Followings',include:{model: User,as:'Followers'}},
          ],
          order: [['createdAt', 'DESC']]
        })
        ,catchTopUsers(req)
      ])
      const tweetsCounts = data.Tweets.length
      let followings = 'followings'
      if (!data) throw new Error("User didn't exists!")
      const user = data.toJSON()
      user.Followings.forEach(e=>{
        e.isFollowed = e.Followers.some(f=>f.id===helpers.getUser(req).id)
      })
      user.Followings=user.Followings.reverse()
      return res.render('followings', {
        data: user,
        topUsers,
        tweetsCounts,
        followings
      })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { name, introduction } = req.body
      const { avatar , cover } = req.files
      let uploadAvatar = ''
      let uploadCover = ''
      
      if (avatar) {
        uploadAvatar = await imgurFileHandler(avatar[0])
      }
      if (cover) {
        uploadCover = await imgurFileHandler(cover[0])
      }
      const user = await User.findByPk(UserId)
      if (!name) throw new Error("名稱不可為空白!")
      if (name.length > 50) throw new Error("名稱內容不可超過50字!")
      if (introduction.length > 160) throw new Error("自我介紹內容不可超過160字!")
        await user.update({
        name,
        introduction,
        avatar: uploadAvatar || user.avatar,
        cover: uploadCover || user.cover
      })
      res.redirect(`/users/${UserId}/tweets`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
