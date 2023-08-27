const { User, Tweet, Reply, Like } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['updatedAt', 'DESC']],
        include: User
      })
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        simpleText: tweet.description.substring(0, 50)
      })
      )
      return res.render('admin/tweets', { tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    const { tweetId } = req.params
    try {
      const tweet = await Tweet.findByPk(tweetId)
      const replies = await Reply.findAll({ where: { TweetId: tweetId } })
      const likes = await Like.findAll({ where: { TweetId: tweetId } })

      if (!tweet) throw new Error("This tweet didn't exist!")
      await tweet.destroy()

      if (replies) await Reply.destroy({ where: { TweetId: tweetId } })

      if (likes) await Like.destroy({ where: { TweetId: tweetId } })

      return res.redirect('/admin/tweets')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
