const { Tweet, User, Reply, Like } = require('../../models')
const helpers = require('../../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetData = tweets.map(t => ({
          ...t.toJSON(),
          replyCounts: t.Replies.length,
          likeCounts: t.Likes.length
        }))
        res.render('tweets', { tweetData })
      })
      .catch(err => next(err))
  },
  addTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不可超過140字')
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功發布推文')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
