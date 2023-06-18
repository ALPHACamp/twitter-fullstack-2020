const { Tweet, User, Like, Followship } = require('../models')
const adminController = {
  getSignin: (req, res) => {
    res.render('admin/signin')
  },
  adminSignin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    const tweetRoute = true // admin sidebar判斷目前路由
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        res.render('admin/tweets', { tweets, tweetRoute })
      })
      .catch(err => next(err))
  },
  deleteTweets: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet did'n exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },
  getUsers: async (req, res, next) => {
    const users = await User.findAll({
      raw: true
    })
    const userData = await Promise.all(
      users.map(async user => {
        const userId = user.id
        const [tweets, likes, followers, followings] = await Promise.all([
          // 用user id進去個表格找
          Tweet.findAll({ where: { userId }, raw: true }),
          Like.findAll({ where: { userId }, raw: true }),
          Followship.findAll({ where: { followerId: userId }, raw: true }),
          Followship.findAll({ where: { followingId: userId }, raw: true })
        ])
        user.tweetsCount = tweets?.length // 照到後計算個陣列個數
        user.likesCount = likes?.length
        user.followersCount = followers?.length
        user.followingsCount = followings?.length

        return user
      })
    )
    const sortedUser = userData.sort((a, b) => b.tweetsCount - a.tweetsCount)

    res.render('admin/users', { user: sortedUser })
  },
  getLogout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = adminController
