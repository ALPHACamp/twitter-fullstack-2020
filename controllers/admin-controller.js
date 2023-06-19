const { Tweet, User, Reply, Like } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入後台')
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

      await Reply.destroy({ where: { TweetId: tweet.id } })

      await tweet.destroy()

      req.flash('success_messages', '成功刪除推文')

      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      where: { role: 'user' },
      include: [
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] },
        {
          model: Tweet,
          attributes: ['id'],
          include: [{ model: Like, attributes: ['id'] }]
        }
      ]
    })
      .then(users => {
        const result = users.map(user => {
          // 計算使用者所有推文的Likes數
          let sumLikes = 0

          user.Tweets?.forEach(tweet => {
            sumLikes += tweet.Likes?.length
          })
          // 回傳result
          return {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            followingCounts: user.Followings.length,
            tweetsCounts: user.Tweets.length,
            LikesCounts: sumLikes
          }
        })
        // 依推文數排序
        result.sort((a, b) => b.tweetsCounts - a.tweetsCounts)

        res.render('admin/users', { users: result })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
