const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  //貼文相關
  //顯示所有貼文
  getTweets: (req, res) => {
    return Tweet.findAll({ 
      raw: true, 
      nest: true, 
      include: [User]
    })
      .then(tweet => {
        return res.render('admin/adminTweets', { tweet: tweet })
      }) //目前可以看到全部
  },
  //刪除貼文
  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
    .then((tweet) => {
      tweet.destroy()
    })
    .then((tweet) => {
      res.redirect('/admin/tweets')
    })
  },
  getUsers: (req, res) => {
    return User.findAll( {raw: true} )
    .then(user => {
      res.render('admin/user', {user:user})
    })
    
  }
}

module.exports = adminController