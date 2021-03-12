const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like


const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    return res.render('admin/main')
  },
  getTweets: async (req, res) => {
    await Tweet.findAll({
      include: [User]
    }).then(tweets => {
      tweets = tweets.map(item => ({
        ...item.dataValues,
        description: item.description.substring(0, 50),
        name: item.User.name,
        account: item.User.account,
        avatar: item.User.avatar,
      }))
      // console.log(tweets)
      res.render('admin/tweets', { tweets })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findById(req.params.id)
      .then((tweets) => {
        tweets.destroy()
          .then((tweets) => {
            res.redirect('/admin/tweets')
          })
      })
  },
  getUsers: async (req, res) => {
    await User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        FollowingCount: user.Followings.length,
        likesCount: user.Likes.length,
        tweetsCount: user.Tweets.length,
      }))

      users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
      return res.render('admin/users', { users: users })

    })
  },
}

module.exports = adminController