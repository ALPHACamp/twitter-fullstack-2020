const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  // 後台登入
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    // req.flash('success_msg', '登入成功')
    return res.redirect('/admin/tweets')
  },
  // 後台頁面
  adminGetTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: User
      })
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        description: tweet.description.substring(0, 50)
      })
      )
      return res.render('admin/tweets', { tweets })
    } catch (e) {
      next(e)
    }
  },
  deleteUserTweet: async (req, res, next) => {
    const { tid } = req.params
    try {
      const tweet = await Tweet.findByPk(tid)
      const replies = await Reply.findAll({ where: { TweetId: tid } })
      const likes = await Like.findAll({ where: { TweetId: tid } })
      if (!tweet) throw new Error("This tweet didn't exist!")
      // await tweet.destroy()
      if (replies) await Reply.destroy({ where: { TweetId: tid } })
      if (likes) await Like.destroy({ where: { TweetId: tid } })
      return res.redirect('/admin/tweets')
    } catch (e) {
      next(e)
    }
  },
  adminGetUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Tweet, include: [Like] }
        ]
      })
      const usersList = users.map(user => {
        const { Followings, Followers, Tweets, ...userData } = user.toJSON()
        const userLikes = Tweets.map(tweet => { return tweet.Likes.length })
        let totalLikes = 0
        userLikes.forEach(tweetLikes => totalLikes += tweetLikes)

        userData.totalFollowings = Followings.length
        userData.totalFollowers = Followers.length
        userData.totalTweets = Tweets.length
        userData.totalLikes = totalLikes

        return userData
      })
      const sortedUsers = usersList.sort((a, b) => b.totalTweets - a.totalTweets)

      return res.render('admin/users', { users: sortedUsers })
    } catch (e) {
      next(e)
    }
  }
}
module.exports = adminController