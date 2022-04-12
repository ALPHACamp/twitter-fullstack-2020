const bcrypt = require('bcryptjs')
const { User, Tweet, Followship, Reply, Like } = require('../models')
const helpers = require('../_helpers')

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
        ]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const likedTweetId = helpers.getUser(req) && helpers.getUser(req).Likes.map(l => l.tweetId)
        const data = user.Tweets.map(t => ({
          ...t.toJSON(),
          isLiked: likedTweetId.includes(t.id)
        }))
        const userData = users.map(u => ({
          ...u,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id)
        }))
        return res.render('user/tweets', { viewUser: user.toJSON(), user: helpers.getUser(req), tweets: data, users: userData })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId, {
        nest: true,
        include: [
          { model: Reply, include: [{ model: Tweet, include: [User] }] },
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const userData = users.map(u => ({
          ...u,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id)
        }))
        return res.render('user/replies', { viewUser: user.toJSON(), user: helpers.getUser(req), users: userData })
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
          { model: Like, include: [{ model: Tweet, include: [User, Reply, Like] }] }
        ]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const likedTweetId = helpers.getUser(req) && helpers.getUser(req).Likes.map(l => l.tweetId)
        const data = user.Likes.map(l => ({
          ...l.toJSON(),
          isLiked: likedTweetId.includes(l.Tweet.id)
        }))
        const userData = users.map(u => ({
          ...u,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id)
        }))
        return res.render('user/likes', { viewUser: user.toJSON(), likes: data, user: helpers.getUser(req), users: userData })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    const followerId = helpers.getUser(req).id
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (followship) throw new Error('You have already followed this user!')

        return Followship.create({
          followerId,
          followingId: userId
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
        ]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const followings = user.toJSON().Followings.map(f => ({
          ...f,
          isFollowed: helpers.getUser(req).Followings.some(f2 => f2.id === f.id)
        }))
        const userData = users.map(u => ({
          ...u,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id)
        }))
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
        ]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([user, users]) => {
        if (!user) throw new Error("User doesn't exist!")
        const followers = user.toJSON().Followers.map(f => ({
          ...f,
          isFollowed: helpers.getUser(req).Followers.some(f2 => f2.id === f.id)
        }))
        const userData = users.map(u => ({
          ...u,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id)
        }))
        return res.render('user/followers', { viewUser: user.toJSON(), followers, user: helpers.getUser(req), users: userData })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
