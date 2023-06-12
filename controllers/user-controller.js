const { User, Tweet, Reply, Followship, Like } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !name || !email || !password || !passwordCheck) {
      req.flash('error_message', '所有欄位都是必填')
      return req.redirect('/signup')
    }

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_message', '密碼不相符')
      return req.redirect('/signup')
    }

    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { name } })
    ])
      .then(([account, name]) => {
        if (account) throw new Error('account 已重複註冊！')
        if (name) throw new Error('name 已重複註冊！')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        isAdmin: false
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => {
        req.flash('error_message', `${err}`)
        return req.redirect('/signup')
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/tweets')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logOut(() => { })
    res.redirect('/signin')
  },
  settingPage: (req, res) => {
    res.render('setting')
  },
  getUser: (req, res, next) => { // 取得個人資料頁面(推文清單)
    const isUser = helpers.getUser(req).id === Number(req.params.id)

    return Promise.all([
      Tweet.findAll({
        where: { userId: req.params.id },
        include: [
          User,
          Reply,
          { model: User, as: 'LikedUsers' }
        ],
        nest: true
      }),
      User.findByPk((req.params.id), {
        where: { role: 'user' },
        include: [
          Tweet,
          { model: Tweet, as: 'LikedTweets', include: [User] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [
          ['Tweets', 'createdAt', 'DESC']
        ]
      })
    ])
      .then(([tweets, user]) => {
        const isFollowed = user.Followers.some(f => f.id === helpers.getUser(req).id)
        const data = tweets.map(tweet => ({
          ...tweet.toJSON(),
          isLiked: helpers.getUser(req)?.LikedTweets?.map(t => t.id).includes(tweet.id)
        }))

          .sort((a, b) => b.createdAt - a.createdAt)
        return res.render('users', { users: user.toJSON(), tweet: data, isUser, isFollowed })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => { // 修改使用者名稱、自我介紹、大頭照、背景圖
    const { name, introduction } = req.body
    const avatar = req.files ? req.files.avatar : null
    const cover = req.files ? req.files.cover : null

    if (!name) throw new Error('User name is required!')

    return User.findByPk(helpers.getUser(req).id)
      .then(async user => {
        if (!user) throw new Error("User didn't exist!")
        const avatarFilePath = avatar ? await imgurFileHandler(avatar[0]) : user.avatar
        const coverFilePath = cover ? await imgurFileHandler(cover[0]) : user.cover
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover
        })
      })
      .then(() => {
        req.flash('success_messages', 'User was successfully to update')
        res.redirect('/users/`${helpers.getUser(req).id}`/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
