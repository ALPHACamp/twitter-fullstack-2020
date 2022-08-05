const { Tweet, User, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        nest: true,
        include: [User, Reply, Like]
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([tweets, followship]) => {
        const user = helpers.getUser(req)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50),
          User: t.User.dataValues,
          user,
          isLiked: t.Likes.length > 0

        }))

        const recommendFollower = followship
          .map(data => {
            return {
              followingCount: data.dataValues.count,
              ...data.User.toJSON(),
              isFollowed: user?.Followings.some(u => u.id === data.followingId)
            }
          })
          .slice(0, 10)

        res.render('tweets', { tweets: data, user, recommendFollower, currentUser })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const description = req.body.description

    if (!req.body.description) {
      return res.redirect('/')
    }

    if (req.body.description.length > 140) {
      return res.redirect('/')
    }

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
    const currentUser = helpers.getUser(req)
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    return Promise.all([Tweet.findByPk(tweetId, {
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [User, Reply, Like]
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
    }),
    Followship.findAll({
      include: User,
      group: 'followingId',
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
      },
      order: [[sequelize.literal('count'), 'DESC']]
    })
    ])
      .then(([tweet, replies, likes, followship]) => {
        const user = helpers.getUser(req)
        const data = replies.map(r => ({
          ...r,
          author: tweet.User.account
        }))

        const post = {
          tweet: tweet,
          isLiked: likes?.some(l => l.UserId === userId)
        }

        const recommendFollower = followship
          .map(data => {
            return {
              followingCount: data.dataValues.count,
              ...data.User.toJSON(),
              isFollowed: user?.Followings.some(u => u.id === data.followingId)
            }
          })
          .slice(0, 10)

        res.render('tweet', { tweet: post, replies: data, likes, recommendFollower, currentUser })
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
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    Like.create({
      UserId,
      TweetId
    }).then(() => {
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
