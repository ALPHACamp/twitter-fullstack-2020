const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Likes = db.Like
const Reply = db.Replies
const Followers = db.Followships

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

  getUsers: (req, res) => {
    User.findAll({
      raw: true, nest: true,
      include: [
        { model: Tweet, as: 'Replyer' },
        { model: Tweet, as: 'Liker' },
        { model: User, as: 'Followers' }
      ]
    }).then(tweets => {
      tweets = tweets.map(r => ({
        ...r,        
        ReplyerCount: r.User.Replyer.length,
        LikerCount: r.User.Liker.length,
        FollowerCount: r.User.Followers.length,
      }))
      console.log(tweets)
      return res.render('admin/tweetsUser', { users: data })
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
