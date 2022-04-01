const { Tweet, User, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      }),
      User.findAll({
        raw: true
      })
    ])
      .then(([tweets, users]) => {
        const likedTweetId = helpers.getUser(req) && helpers.getUser(req).Likes.map(l => l.tweetId)
        const data = tweets.map(t => ({
          ...t,
          isLiked: likedTweetId.includes(t.id)
        }))
        return res.render('tweets', { tweets: data, users, user: helpers.getUser(req) })
      })
  },
  postTweet: (req, res, next) => {
    const { content } = req.body
    if (!content) throw new Error('Please enter tweet content!')

    return Tweet.create({
      userId: helpers.getUser(req).id,
      content
    })
      .then(() => {
        req.flash('success_messages', 'Tweet posted')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { tweetId } = req.params
    const userId = helpers.getUser(req).id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        if (like) throw new Error('You have already liked this tweet!')

        return Like.create({
          userId,
          tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        tweetId: req.params.tweetId,
        userId: helpers.getUser(req).id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = tweetController
