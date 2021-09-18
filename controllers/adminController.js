const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (!req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入後台！')
      res.redirect('/admin/tweets')
    }
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登入！')
    req.logOut()
    res.redirect('admin/signin')
  },
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar'],
          where: { role: 0 }
        }
      })
      tweets = tweets.map(data => ({
        ...data,
        description:
          data.description.length < 50
            ? data.description
            : data.description.substring(0, 50) + '...'
      }))
      return res.render('admin/tweets', { tweets })
    } catch (err) {
      console.log(err)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const id = req.params.tweetId

      await Tweet.destroy({ where: { id } })
      return res.redirect('admin/tweets')
    } catch (err) {
      console.log(err)
    }
  },
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        where: { role: 0 },
        attributes: ['name', 'account', 'avatar', 'cover'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' },
          Tweet
        ]
      })
      users = users.map(r => ({
        ...r.dataValues,
        followerCount: r.Followers.length,
        followingCount: r.Followings.length,
        tweetCount: r.Tweets.length,
        likedCount: r.LikedTweets.length
      }))
      users.sort((a, b) => b.tweetCount - a.tweetCount)

      return res.render('admin/users', {users})
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
