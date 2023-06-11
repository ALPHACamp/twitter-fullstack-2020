const { Tweet, User, Reply } = require('../models')
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
      // 未來會取得追蹤數前 10 名的使用者資料
      User.findAll({
        // limit: 10,
        where: { isAdmin: 0 },
        raw: true
      }),
      User.findByPk(userId, { raw: true })
    ])
      .then(([tweets, topUsers, currentUser]) => {
        res.render('tweets', { tweets, topUsers, currentUser })
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
        res.render('tweet', { tweet, replies })
      })
  }
}

module.exports = tweetController
