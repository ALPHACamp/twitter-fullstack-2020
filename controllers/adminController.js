const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
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
        content: t.content.substring(0, 50)
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
      raw: true,
      nest: true,
      where: { is_admin: false },
      group: 'id',
      attributes: [
        'id', 'account', 'name', 'email', 'description', 'img', 'bg_img', 'createdAt', 'updatedAt',
        [sequelize.fn('count', sequelize.col('Tweets.id')), 'tweetCount']
      ],
      include: [{ model: Tweet, attributes: ['id'] }],
      order: [[sequelize.literal('tweetCount'), 'desc']]
    }).then(users => {
      return res.render('admin/users', { users })
    })
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      attributes: [
        'id', 'account', 'name', 'email', 'description', 'img', 'createdAt', 'updatedAt',
        [sequelize.fn('count', sequelize.col('Tweets.id')), 'tweetCount']
      ],
      include: [{ model: Tweet, attributes: ['id'] }]
    }).then(user => {
      theuser = user.toJSON()
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
    return User.findByPk(req.user.id).then(theuser => {
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
      console.log(req.body, '------', req.file)
      if (!name || !account || !email) {
        req.flash('error_messages', '皆必填，不可以空白')
        return res.redirect('back')
      }

      const [a, e] = await Promise.all([User.findOne({ raw: true, nest: true, where: { account } }), User.findOne({ raw: true, nest: true, where: { email } })])
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
        const admin = await User.findByPk(req.user.id)
        await admin.update({
          name, account, email,
          img: file ? img.date.link : user.img
        })
        req.flash('success_messages', '成功更新個人資料！')
        return res.redirect('/admin/profile')
      })
    } catch (error) {
      console.warn(error)
    }
  },
  // check: (req, res) => {
  //   return res.json({ status: 200 })
  // }
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