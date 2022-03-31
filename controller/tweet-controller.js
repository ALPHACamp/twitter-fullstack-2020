const { Tweet, User } = require('../models')
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
        return res.render('tweets', { tweets, users, user: helpers.getUser(req) })
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
  }
}
module.exports = tweetController
