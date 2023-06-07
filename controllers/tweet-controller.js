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
        console.log(users)
        res.render('tweets', { tweets, users })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
