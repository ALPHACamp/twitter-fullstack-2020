const { Tweet, User, Reply } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入後台')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        if (!tweets) throw new Error('沒有任何推文')
        const slicedTweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.slice(0, 50)
        }))
        res.render('admin/tweets', { tweets: slicedTweets })
      })
      .catch(err => next(err))
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [Reply]
      })

      if (!tweet) throw new Error('該推文不存在')

      await Reply.destroy({ where: { tweetId: tweet.id } })

      await tweet.destroy()

      req.flash('success_message', '成功刪除推文')

      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController
