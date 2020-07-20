const db = require('../models')
const Tweet = db.Tweet
const User = db.User


let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true, nest: true, include: [User] }).then(result => {
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        userName: r.dataValues.User.name,
        userAvatar: r.dataValues.User.avatar,
        createdAt: r.dataValues.createdAt
      }))
      return res.render('admin/tweetsHome', { tweets: data })
    })
  },
}

module.exports = adminController;
