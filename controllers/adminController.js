const db = require('../models')
const Tweet = db.Tweet
const User = db.User


let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },

  getTweets: (req, res) => {
    Tweet.findAll({ raw: true, nest: true, include: User, }).then(tweets => {
      const data = tweets.map(r => ({
        ...r,
        userName: r.User.name,
        userAvatar: r.User.avatar,
        description: r.description.substring(0, 50),
        createdAt: r.createdAt
      }))      
      return res.render('admin/tweetsHome', { tweets: data })
    })
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
      .then((Tweet) => {
        Tweet.destroy()
          .then((Tweet) => {
            req.flash('success_messages', '刪除成功！')
            return res.redirect('/admin/tweets')
          })
      })
  },
}

module.exports = adminController;
