const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
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
      })
    ])
      .then(([tweets, users]) => {
        // console.log(users)
        res.render('tweets', { tweets, users })
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    console.log(req.body)
    if (!description) throw new Error('Tweet is required!')
    if (description.length > 140) throw new Error('Tweet length must be under 140 character!')
    Promise.all([
      Tweet.create({ description })
    ])
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
