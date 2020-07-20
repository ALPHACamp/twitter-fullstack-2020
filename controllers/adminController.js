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
        userName: r.User.name,
        userAvatar: r.User.avatar,
        description: r.description.substring(0, 50),
        createdAt: r.createdAt
      }))
      console.log(data)
      return res.render('admin/tweetsHome', { tweets: data })
    })
  },
}

module.exports = adminController;
