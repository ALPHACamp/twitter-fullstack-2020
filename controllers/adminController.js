const { User, Reply, Tweet, Like } = require('../models')
const helpers = require("../_helpers")

const adminController = {
  getTweets:(req, res) => {
    Tweet.findAll({
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
  getUsers:(req,res) => {
    User.findAll({ 
      include: [
        { model: Like, include: [Tweet] },
        {
          model: Tweet,
          include: [User]
        },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" }
      ] 
    }).then(users => {
      const data = users.map(u => ({
        ...u.dataValues,
        //TweetCount: users.Tweets.length
/*         LikeCount: users.Like.length,
        TweetCount: users.Tweet.length,
        FollowerCount: users.Followers.length,
        FollowingCount: users.Followings.length, */
      }))
      console.log(data.TweetCount)
      return res.render('admin/users', {
        users: data
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
