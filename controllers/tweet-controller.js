const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const reqUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User }, { model: Reply }, { model: Like }]
      }),
      Like.findAll({
        where: {
          userId: helpers.getUser(req).id
        },
        raw: true
      })
    ])
      .then(([tweets, like]) => {
        const likedTweets = like.map(like => like.tweetId)
        const data = tweets.map(t => ({
          ...t.toJSON(),
          isLiked: likedTweets.includes(t.id)
        }))
        // console.log(data)
        res.render('tweet', { tweets: data, reqUser })
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('不可超過140字')
    User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({ description, UserId })
      })
      .then(tweet => {
        // console.log(tweet)
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { tweetId } = req.params
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: helpers.getUser(req).id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        // console.log(like)
        if (!tweet) throw new Error("tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          userId: helpers.getUser(req).id,
          tweetId: req.params.tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: helpers.getUser(req).id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")
        // console.log(like)
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = tweetController
