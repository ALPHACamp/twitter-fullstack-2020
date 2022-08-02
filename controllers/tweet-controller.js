const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id

    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      nest: true,
      include: [User, Reply, Like, { model: User, as: 'likedUsers' }]
    })
      .then(tweets => {
        const user = helpers.getUser(req)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50),
          User: t.User.dataValues,
          user,
          isLiked: t.likedUsers.some(item => item.id === userId)

        }))
        res.render('tweets', { tweets: data, user })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const description = req.body.description

    User.findByPk(userId, {
      raw: true,
      nest: true
    })
    return Tweet.create({
      userId,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功發布推文')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    return Promise.all([Tweet.findByPk(tweetId, {
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [User, Reply, Like, { model: User, as: 'likedUsers' }]
    }),
    Reply.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: User,
      where: { tweet_id: tweetId }
    }),
    Like.findAll({
      raw: true,
      where: { tweet_id: tweetId }
    })
    ])
      .then(([tweet, replies, likes]) => {
        const data = replies.map(r => ({
          ...r
        }))
        const post = {
          tweet: tweet,
          isLiked: tweet.likedUsers.id === userId
        }
        res.render('tweet', { tweet: post, replies: data, likes })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const TweetId = req.params.id
    const comment = req.body.reply

    Reply.create({
      userId,
      TweetId,
      comment
    }).then(reply => {
      res.redirect(`/tweets/${TweetId}/replies`)
    })
      .catch(err => next(err))
  },
  likePost: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    // const
    Like.create({
      userId,
      tweetId
    }).then(like => {
      res.redirect('back')
    })
      .catch(err => next(err))
  },
  unlikePost: (req, res, next) => {
    const TweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId
      }
    }).then(like => {
      return like.destroy()
        .then(() => {
          res.redirect('back')
        })
    })
      .catch(err => next(err))
  }
}

module.exports = tweetController
