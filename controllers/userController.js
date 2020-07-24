const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const FollowShip = db.FollowShip
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
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('successMessage', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //該名使用者的所有推文
  getTweets: (req, res) => {
    Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        Reply,
        { model: User, as: 'likedUsers' },
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      res.render('user-tweets', { tweets })
    })
  },
  //該名使用者的所有喜歡內容
  getLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Reply,
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
      ]
    })
      .then(user => {
        console.log(user.toJSON())
        res.render('user-likes', { user: user.toJSON() })
      })
  },
  //該名使用者的所有回覆內容
  getReplies: (req, res) => res.render('user-replies'),
  editUser: (req, res) => res.render('setting'),
  putUser: (req, res) => {
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
  follow: (req, res) => {
    const followingId = req.params.id
    const followerId = req.user.id
    return FollowShip.create({ followingId, followerId })
      .then(() => res.redirect('back'))
  },
  unfollow: (req, res) => {
    const followingId = req.params.id
    const followerId = req.user.id
    return FollowShip.findOne({ where: { followingId, followerId } })
      .then(followship => followship.destroy())
      .then(() => res.redirect('back'))
  }
}

module.exports = userController