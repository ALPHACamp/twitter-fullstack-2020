const bcrypt = require('bcrypt-nodejs')
const { authenticate } = require('passport')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply

const pageLimit = 10

const adminController = {
  getLogin: (req, res) => {
    return res.render('adminLogin', { layout: "userMain" })
  },

  postLogin: (req, res) => {
    res.redirect('/admins')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/admins/login')
  },

  getAdmin: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    return Tweet.findAndCountAll({
      include: [User],
      offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(t => ({
        ...t.dataValues,
        content: t.dataValues.content.substring(0, 50),
        avatar: t.User.avatar,
        account: t.User.account,
        name: t.User.name
      }))
      return res.render('admin', {
        layout: 'adminMain',
        tweets: data,
        page,
        totalPage,
        prev,
        next
      })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(() => {
            res.redirect('/admins')
          })
      })
  }
}

module.exports = adminController