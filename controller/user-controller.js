const bcrypt = require('bcryptjs')
const { User, Tweet, Followship, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', { url: req.url })
  },
  signUp: (req, res, next) => {
    if (req.body.passwordCheck && req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    return Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([registeredAccount, registeredEmail]) => {
        if (registeredAccount) throw new Error('User already exists!')
        if (registeredEmail) throw new Error('User already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin', { url: req.url })
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '請從後台登入')
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.flash('success_messages', 'Login successfully')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    res.redirect('/signin')
  },
  getTweets: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          { model: Tweet, include: [Reply, Like] },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        order: [[{ model: Tweet }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([viewUser, users]) => {
        if (!viewUser) throw new Error("User doesn't exist!")
        const user = helpers.getUser(req)
        const likedTweetId = user.Likes && user.Likes.map(l => l.tweetId)
        const tweets = viewUser.Tweets.map(t => ({
          ...t.toJSON(),
          isLiked: likedTweetId && likedTweetId.includes(t.id)
        }))
        users = users.map(u => ({
          ...u.toJSON(),
          isFollowed: user.Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        viewUser = {
          ...viewUser.toJSON(),
          isFollowed: user.Followings.some(f => f.id === viewUser.toJSON().id)
        }
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('user/tweets', { viewUser, user, tweets, users })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          { model: Reply, include: [{ model: Tweet, include: [User], required: true }] },
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        order: [[{ model: Reply }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        let userData = users.map(u => ({
          ...u.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        const viewUser = {
          ...user.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.toJSON().id)
        }
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('user/replies', { viewUser, user: helpers.getUser(req), users: userData })
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Like, include: [{ model: Tweet, include: [User, Reply, Like], required: true }] }
        ],
        order: [[{ model: Like }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([viewUser, userData]) => {
        if (!viewUser) throw new Error("User doesn't exist!")
        const user = helpers.getUser(req)
        const likedTweetId = user.Likes && user.Likes.map(l => l.tweetId)
        const likes = viewUser.Likes.map(l => ({
          ...l.toJSON(),
          isLiked: likedTweetId && likedTweetId.includes(l.Tweet.id)
        }))
        userData = userData.map(u => ({
          ...u.toJSON(),
          isFollowed: user.Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        viewUser = {
          ...viewUser.toJSON(),
          isFollowed: user.Followings.some(f => f.id === viewUser.toJSON().id)
        }
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('user/likes', { viewUser, likes, user, users: userData })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id

    if (followingId === followerId) {
      req.flash('error_messages', "Can't follow yourself!")
      return res.redirect(200, 'back')
    }

    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (followship) throw new Error('You have already followed this user!')

        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't follow this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          Tweet,
          { model: User, as: 'Followings' }
        ],
        order: [[{ model: User, as: 'Followings' }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const followings = user.toJSON().Followings.map(f => ({
          ...f,
          isFollowed: helpers.getUser(req).Followings.some(f2 => f2.id === f.id)
        }))
        let userData = users.map(u => ({
          ...u.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('user/followings', { viewUser: user.toJSON(), followings, user: helpers.getUser(req), users: userData })
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          Tweet,
          { model: User, as: 'Followers' }
        ],
        order: [[{ model: User, as: 'Followers' }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([viewUser, userData]) => {
        if (!viewUser) throw new Error("User doesn't exist!")
        const user = helpers.getUser(req)
        const followers = viewUser.toJSON().Followers.map(f => ({
          ...f,
          isFollowed: user.Followers && user.Followers.some(f2 => f2.id === f.id)
        }))
        userData = userData.map(u => ({
          ...u.toJSON(),
          isFollowed: user.Followings && user.Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('user/followers', { viewUser: viewUser.toJSON(), followers, user, users: userData })
      })
      .catch(err => next(err))
  },
  getSettings: (req, res, next) => {
    const { userId } = req.params
    if (Number(userId) !== helpers.getUser(req).id) { return res.redirect(200, 'back') }

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        res.render('user/setting', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  postSettings: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (passwordCheck && password !== passwordCheck) throw new Error('Passwords do not match!')

    return Promise.all([
      User.findByPk(req.params.userId),
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user, registeredAccount, registeredEmail]) => {
        if (registeredAccount && registeredAccount.toJSON().id !== user.toJSON().id) throw new Error('Account already been used!')
        if (registeredEmail && registeredEmail.toJSON().id !== user.toJSON().id) throw new Error('Email already been used!')

        return Promise.all([
          User.findByPk(req.params.userId),
          bcrypt.hash(password, 10)
        ])
      })
      .then(([user, hash]) => user.update({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功更新帳號資訊！')
        return res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  postProfile: (req, res, next) => {
    const { name, introduction } = req.body
    const { userId } = req.params
    const { files } = req
    const avatarFile = files?.avatar || null
    const coverFile = files?.cover || null

    if (files) {
      return Promise.all([
        User.findByPk(userId),
        imgurFileHandler(avatarFile),
        imgurFileHandler(coverFile)
      ])
        .then(([user, avatarPath, coverPath]) => {
          if (!user) throw new Error("User doesn't exist!")
          return user.update({
            name,
            introduction,
            avatar: avatarPath || user.avatar,
            cover: coverPath || user.cover
          })
        })
        .then(() => {
          req.flash('success_messages', '成功更新帳號資訊！')
          return res.redirect('/tweets')
        })
        .catch(err => next(err))
    } else {
      return User.findByPk(userId)
        .then(user => {
          if (!user) throw new Error("User doesn't exist!")
          return user.update({
            name,
            introduction
          })
        })
        .then(() => {
          req.flash('success_messages', '成功更新帳號資訊！')
          return res.end()
        })
    }
  },
  getUser: (req, res) => {
    const user = helpers.getUser(req)
    const viewUserId = Number(req.params.userId)
    if (user.id !== viewUserId) {
      return res.json({ status: 'error', message: '' })
    }
    return User.findByPk(viewUserId)
      .then(user => {
        return res.json(user.toJSON())
      })
  }
}
module.exports = userController
