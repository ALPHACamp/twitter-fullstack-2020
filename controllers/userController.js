const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []

    if (password !== passwordCheck) {
      error.push({ message: '密碼與確認密碼必須相同' })
      return res.render('signup', { account, name, email, errorMessage })
    }

    User.findOne({ where: { $or: [{ email }, { account }] }, raw: true })
      .then(user => {
        if (user) {
          if (user.email === email) { error.push({ message: 'Email已被註冊' }) }
          if (user.account === account) { error.push({ message: '帳號已被使用' }) }
          return res.render('signup', { account, email, name, error })
        }
        if (!user) {
          return User.create({ account, name, email, password: hashPassword })
            .then(() => {
              req.flash('successMessage')
              res.redirect('signin')
            })
        }
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('successMessage', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getIndexPage: (req, res) => {
    if (req.isAuthenticated() && req.user.role === 'user') { return res.redirect('/tweets') }
    if (req.isAuthenticated() && req.user.role === 'admin') { return res.redirect('/admin/tweets') }
    res.redirect('/signin')
  },
  editUser: (req, res) => res.render('setting'),
  putUser: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const error = []
    User.findOne({ where: { id: req.user.id } })
      .then(user => {
        if (!account || !name || !email || !password || !passwordCheck) {
          error.push({ message: '所有欄位皆為必填!' })
          return res.render('setting', { error })
        }
        if (password !== passwordCheck) {
          error.push({ message: '密碼與確認密碼必須相同' })
          return res.render('setting', { error })
        }
        return user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        }).then(() => {
          res.redirect('/tweets')
        })
      })
  },
  getTweets: (req, res) => {
    const id = req.params.id
    return User.findByPk(id, {
      include: [
        { model: Tweet, include: [Reply, { model: User, as: 'LikedUsers' },] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(user => {
        res.render('user-tweets', { pageUser: user.toJSON() })
      })
  },
  getLikes: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        Reply,
        Tweet,
        { model: Tweet, as: 'LikedTweets', include: [User, Reply, { model: User, as: 'LikedUsers' }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(user => {
        res.render('user-likes', { pageUser: user })
      })
  },
  getReplies: (req, res) => {
    Reply.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
    }).then(replies => {
      User.findOne({
        where: { id: req.params.id },
        include: [Tweet, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
      })
        .then(user => {
          res.render('user-replies', { replies, pageUser: user })
        })
    })
  },
  putUserProfile: (req, res) => {
    const id = Number(req.params.id)
    const { name, introduction } = req.body
    const { avatar, cover } = req.files
    const { files } = req

    if (req.user.id !== id) {
      req.flash('errorMessage', 'error')
      res.redirect('/tweets')
    }

    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (avatar) {
        avatarPath = avatar[0].path
        imgur.upload(avatarPath, (err, img) => {
          User.findByPk(id)
            .then(user => user.update({ avatar: img.data.link }))
        })
      }
      if (cover) {
        coverPath = cover[0].path
        imgur.upload(coverPath, (err, img) => {
          User.findByPk(id)
            .then(user => user.update({ cover: img.data.link }))
        })
      }
    }
    return User.findByPk(id)
      .then(user => {
        user.update({ name, introduction })
      })
      .then(() => {
        res.redirect('/tweets')
      })
  },
  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }, { model: Tweet }]
    }).then(user => {
      const Followings = user.Followings.map(following => ({
        ...following.dataValues,
        isFollowed: user.Followings.map((i) => i.id).includes(following.id)
      }))
      const results = {
        user,
        tweetCounts: user.Tweets.length,
        Followings
      }
      res.render('user-followings', { results })
    })
  },
  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }, { model: Tweet }]
    }).then(user => {
      const Followers = user.Followers.map(follower => ({
        ...follower.dataValues,
        isFollowed: req.user.Followings.map((i) => i.id).includes(follower.id)
      }))
      const results = {
        user,
        tweetCounts: user.Tweets.length,
        Followers
      }
      res.render('user-followers', { results })
    })
  },
  addFollow: (req, res) => {
    const followingId = Number(req.params.id)
    const followerId = req.user.id
    return Followship.create({ followingId, followerId })
      .then(() => res.redirect('back'))
  },
  removeFollow: (req, res) => {
    const followingId = Number(req.params.id)
    const followerId = req.user.id
    return Followship.findOne({ where: { followingId, followerId } })
      .then(followship => followship.destroy())
      .then(() => res.redirect('back'))
  }
}

module.exports = userController