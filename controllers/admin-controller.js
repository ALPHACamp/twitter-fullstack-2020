const { User, Tweet, Like, Followship } = require('../models')

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
      if (!tweet) throw new Error("This tweet didn't exist!")
      await tweet.destroy()
      return res.redirect('/admin/tweets')
    } catch (e) {
      next(e)
    }
  },
  adminGetUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({ raw: true, where: { role: 'user' } })
      users = await Promise.all(users.map(async (user) => {
        const userId = user.id
        const followings = await Followship.findAll({ raw: true, where: { followerId: userId } })
        const followers = await Followship.findAll({ raw: true, where: { followingId: userId } })

        // 找出每個user的所有tweets：
        let tweets = await Tweet.findAll({ raw: true, where: { UserId: userId } })
        tweets = await Promise.all(tweets.map(async (tweet) => {
          const tweetId = tweet.id
          // 找出每個tweet的所有likes：
          const likes = await Like.findAndCountAll({ raw: true, where: { TweetId: tweetId }, group: ['TweetId'] })
          tweet.totalTweetLikes = likes.count[0] ? likes.count[0].count : 0 // 若有like就回傳count，沒有就為0
          return tweet
        }))

        // 找出屬於當前使用者的tweet並回傳該tweet的likes：
        const userTweetLikes = tweets.map(tweet => {
          if (tweet.UserId === user.id) return tweet.totalTweetLikes
        })
        let userTotalLikes = 0
        userTweetLikes.forEach(like => userTotalLikes += like) // 計算使用者擁有的tweets的likes

        user.totalFollowings = followings ? followings.length : 0
        user.totalFollowers = followers ? followers.length : 0
        user.totalTweets = tweets ? tweets.length : 0
        user.totalLikes = userTotalLikes
        return user
      }))

      return res.render('admin/users', { users })
    } catch (e) {
      next(e)
    }
  }
}
module.exports = adminController