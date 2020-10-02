const { User, Tweet } = require('../models')
const helpers = require("../_helpers")


const adminController = {
  getTweets:(req, res) => {
    Tweet.findAndCountAll({
        order: [['createdAt', 'DESC']],
        include: [User]

    }).then(tweets => {
        const data = tweets.map(t => ({
            ...t.dataValues,
            description: t.dataValues.description.substring(0, 50),
        }))
        return res.render('admin/tweets', {
            tweets: data
        })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      tweet.destroy()
      .then((tweet) => {
        res.redirect('/admin')
      })
    })
  },
  getUsers:(req,res) => {
    return User.findAll({ 
      include: [
        Tweet,
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Tweet, as: 'LikedTweets' }
      ] 
    }).then(users => {
      users = users.map(u => ({
        ...u.dataValues,
      }))
      users = users.sort((a, b) => b.Tweets.length - a.Tweets.length)
      console.log(users)
      return res.render('admin/users', {
        users: users
      })
    })
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController
