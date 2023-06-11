const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // 獲得所有推文
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id
    Promise.all([
      Tweet.findAll({
        // limit: 2,
        order: [['createdAt', 'DESC']],
        include: [
          User
        ],
        raw: true,
        nest: true
      }),
      User.findAll({
        // limit: 10,
        where: { isAdmin: 0 },
        raw: true
      }),
      User.findByPk(userId, { raw: true })
    ])
      .then(([tweets, users, currentUser]) => {
        // console.log(currentUser)
        res.render('tweets', { tweets, users, currentUser })
      })
      .catch(err => next(err))
  },
  // 新增一則推文
  postTweets: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('Tweet is required!')
    if (description.length > 140) throw new Error('Tweet length must be under 140 character!')
    Promise.all([
      Tweet.create({ description, UserId: helpers.getUser(req).id })
    ])
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  // 獲取特定推文頁面
  getTweet: (req, res, next) => {
    const tweetId = req.params.id
    Promise.all([
      Tweet.findByPk(tweetId, {
        include: [User],
        raw: true,
        nest: true
      }),
      Reply.findAll({
        include: [User],
        where: { tweetId },
        raw: true,
        nest: true
      })
    ])
      .then(([tweet, replies]) => {
        console.log(replies)
        res.render('tweet', { tweet, replies })
      })
  },

  postLike: (req, res, next) => {
    const tweetId = req.params.id
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
        if (!tweet) throw new Error("Tweet doesn't exist!")
        if (like) throw new Error('You have liked this!')
        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  postUnlike: (req, res, next) => {
    const tweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = tweetController
