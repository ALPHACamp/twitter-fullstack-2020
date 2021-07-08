
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const { Op } = require('sequelize')

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
        content: t.content.substring(0, 50)
      }))
      return res.render('admin/tweets', { tweets })
    })
  },
  getUsers: (req, res) => {
    return res.render('admin/users')
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
    const { name, account, email, password, passwordConfirm } = req.body
    const errors = []
    if (!name || !account || !email || !password || !passwordConfirm) {
      errors.push({ msg: '所有欄位都是必填。' })
    }
    if (password !== passwordConfirm) {
      errors.push({ msg: '密碼及確認密碼不一致！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors, name, account, email, password, passwordConfirm
      })
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        errors.push({ msg: '帳號或Email已註冊！' })
        return res.render('signup', {
          errors, name, account, email, password, passwordConfirm
        })
      }
      return User.create({
        name, account, email,
        is_admin: true,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '成功新增管理員！')
        return res.redirect('/admin/users')
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

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const adminController = {
  getTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User]
      })
    ]).then(([tweets]) => {
      return res.render('admin/tweets', {
        tweets: tweets
      })
    })
  },
  createTweet: (req, res) => {
    return res.render('admin/create')
  },
  postTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: req.user.id,
      content: req.body.content,
      likes: req.body.likes
    })
      .then((tweet) => {
        req.flash('success_messages', 'Tweet was successfully created')
        res.redirect('/admin/tweets')
      })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [User]
    })
      .then((tweet) => {
        console.log(`tweet:${tweet}`)
        return res.render('admin/tweet', {
          tweet: tweet.toJSON()
        })
      })
  },
  editTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, { raw: true }).then(tweet => {
      return res.render('admin/create', { tweet: tweet })
    })
  },
  putTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }

    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        Tweet.update({
          UserId: req.user.id,
          content: req.body.content,
          likes: req.body.likes
        })
          .then((tweet) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/tweets')
          })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            res.redirect('/admin/tweets')
          })
      })
  }
}

module.exports = adminController

