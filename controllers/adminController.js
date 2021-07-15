const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const helpers = require('../_helpers')
const { User, Tweet, sequelize } = require('../models')
const { Op } = require('sequelize')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'desc']]
    }).then(tweets => {
      tweets = tweets.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      return res.render('admin/tweets', { tweets })
    })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [User]
    }).then(tweet => {
      tweet = tweet.toJSON()
      return res.render('admin/tweets', { tweet })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then(tweet => {
      req.flash('success_messages', '成功刪除推文')
      tweet.destroy().then(() => {
        res.redirect('/admin/tweets')
      })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      where: { is_admin: false },
      attributes: [
        'id', 'account', 'name', 'email', 'avatar', 'cover'
      ],
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweet' }
      ],
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        tweetCount: user.Tweets.length,
        likeCount: user.LikedTweet.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length
      })).sort((a, b) => b.tweetCount - a.tweetCount)

      return res.render('admin/users', { users })
    })
  },
  getUser: (req, res) => {
    return User.findAll({
      where: { id: req.params.id },
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweet' }
      ]
    }).then(user => {
      theuser = user.map(ur => ({
        ...ur.dataValues,
        tweetCount: ur.Tweets.length,
        likeCount: ur.LikedTweet.length,
        followingCount: ur.Followings.length,
        followerCount: ur.Followers.length
      }))[0]

      return res.render('admin/user', { theuser })
    })
  },
  getAdmins: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true,
      where: { is_admin: true }
    }).then(admin => {

      return res.render('admin/users', { admin })
    })
  },
  getProfile: (req, res) => {
    return res.render('admin/profile')
  },
  getEditProfile: (req, res) => {
    const edit = true
    return User.findByPk(helpers.getUser(req).id).then(theuser => {
      theuser = theuser.toJSON()
      const { name, account, email } = theuser
      return res.render('admin/profile', { edit, name, account, email })
    })
  },
  putProfile: async (req, res) => {
    const { name, account, email } = req.body
    const { file } = req
    const edit = true
    const errors = []
    try {
      if (!name || !account || !email) {
        req.flash('error_messages', '皆必填，不可以空白')
        return res.redirect('back')
      }

      const [a, e] = await Promise.all([User.findOne({ raw: true, nest: true, where: { [Op.and]: [{ account: account }, { account: { [Op.notLike]: helpers.getUser(req).account } }] } }), User.findOne({ raw: true, nest: true, where: { [Op.and]: [{ email }, { email: { [Op.notLike]: helpers.getUser(req).email } }] } })])
      if (a) {
        errors.push({ msg: '此帳號已有人使用。' })
      }
      if (e) {
        errors.push({ msg: '此Email已有人使用。' })
      }
      if (a || e) {
        return res.render('admin/profile', { errors, edit, name, account, email })
      }

      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        const admin = await User.findByPk(helpers.getUser(req).id)
        await admin.update({
          name, account, email,
          img: file ? img.data.link : admin.img
        })
        req.flash('success_messages', '成功更新個人資料！')
        return res.redirect('/admin/profile')
      })
    } catch (error) {
      console.warn(error)
    }
  },

  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  signUpPage: (req, res) => {
    const signup = true
    return res.render('admin/signin', { signup })
  },
  signUp: (req, res) => {
    const signup = true
    const { name, account, email, password, passwordConfirm } = req.body
    const errors = []
    if (!name || !account || !email || !password || !passwordConfirm) {
      errors.push({ msg: '所有欄位都是必填。' })
    }
    if (password !== passwordConfirm) {
      errors.push({ msg: '密碼及確認密碼不一致！' })
    }
    if (errors.length) {
      return res.render('admin/signin', {
        errors, name, account, email, password, passwordConfirm, signup
      })
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        errors.push({ msg: '帳號或Email已註冊！' })
        return res.render('admin/signin', {
          errors, name, account, email, password, passwordConfirm, signup
        })
      }
      return User.create({
        name, account, email,
        is_admin: true,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '成功新增管理員！')
        return res.redirect('/admin/admins')
      })
    })
  },
  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController