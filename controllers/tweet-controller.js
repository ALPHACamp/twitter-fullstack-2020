const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [['created_at', 'DESC']] // 反序
      })

      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      const user = await User.findByPk(helpers.getUser(req).id,
        {
          raw: true,
          nest: true
        })

      const likes = await Like.findAll({
        where: { UserId: helpers.getUser(req).id }
      })

      tweets = await tweets.map(tweet => ({
        ...tweet.toJSON(),
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLiked: likes.map(l => l.TweetId).includes(tweet.id)
      }))

      users = await users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)

      return res.render('tweets', { tweets, users, likes })
    } catch (err) {
      next(err)
    }
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (description.trim() === '') {
      req.flash('error_messages', 'Tweet 內容不能為空')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', 'Tweet 字數不能超過140字')
      return res.redirect('back')
    }
    Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(() => {
        req.flash('success_messages', '成功推文')
        return res.redirect('tweets')
      })
      .catch(err => next(err))
  },
  postLike: (req, res, next) => {
    Promise.all([
      Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      })
    ]).then(() => {
      req.flash('success_messages', 'success like!')
      return res.redirect('back')
    }).catch(err => next(err))
  },
  postUnlike: async (req, res, next) => {
    // 這邊用 Promise.all([]) test 不會過
    try {
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        }
      })
      if (!like) return req.flash('error_messages', '你沒有like這個tweet!')
      await like.destroy()
      req.flash('success_messages', '成功 Unlike!')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getModalsTabs: (req, res) => {
    res.render('modals/self')
  }
}

module.exports = tweetController
