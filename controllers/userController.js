const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like



const userController = {
  getSignup: (req, res) => {
    return res.render('signup', { layout: 'userMain' })
  },

  postSignup: (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error_messages', '兩次密碼輸入不符！')
      res.redirect('/users/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            res.redirect('/users/signup')
          } else {
            User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '註冊成功！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },

  getLogin: (req, res) => {
    return res.render('userLogin', { layout: 'userMain' })
  },

  postLogin: (req, res) => {
    res.redirect('/twitters')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/users/login')
  },

  getUser: (req, res) => {
    const whereQuery = {}
    whereQuery.userId = Number(req.params.id)

    Tweet.findAndCountAll({
      include: [
        User,
        Reply,
        Like
      ],
      where: whereQuery,
      order: [['createdAt', 'DESC']]
    }).then(result => {
      console.log(result)
      const totalTweet = Number(result.count)
      const data = result.rows.map(r => ({
        ...r.dataValues,
        content: r.dataValues.content,
        replyCount: r.dataValues.Replies.length,
        likeCount: r.dataValues.Likes.length
      }))
      User.findByPk(req.params.id)
        .then(user => {
          return res.render('self', {
            user: user.toJSON(),
            totalTweet: totalTweet,
            tweet: data
          })
        })
    })
  },

  getUserReply: (req, res) => {
    res.render('selfReply')
  },

  getUserLike: (req, res) => {
    res.render('selfLike')
  },

  getUserSetting: (req, res) => {
    const id = req.user.id

    User.findByPk(id)
      .then(user => {
        console.log(req.params)
        return res.render('setting', {
          layout: 'settingMain',
          user: user.toJSON()
        })
      })
  },

  putUserSetting: (req, res) => {
    const { account, name, email } = req.body
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          account,
          name,
          email
        }).then(user => {
          return res.redirect(`/users/self/${user.id}`)
        })
      })
  }
}

module.exports = userController