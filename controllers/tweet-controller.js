const { Tweet, User } = require('../models')
const { getUser } = require('../helpers/_helpers')

const tweetController = {
  // 獲得所有貼文
  getTweets: (req, res, next) => {
    const userId = getUser(req).id
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
        console.log(currentUser)
        res.render('tweets', { tweets, users, currentUser })
      })
      .catch(err => next(err))
  },
  // 新增一則貼文
  postTweets: (req, res, next) => {
    const { description } = req.body
    const userId = getUser(req).id
    if (!description) throw new Error('Tweet is required!')
    if (description.length > 140) throw new Error('Tweet length must be under 140 character!')
    Promise.all([
      Tweet.create({ description, userId })
    ])
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
