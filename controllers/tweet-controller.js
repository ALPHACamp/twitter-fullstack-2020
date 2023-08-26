const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res) => {
    const user = req.user
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply],
      nest: true
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          replyCount: tweet.Replies.length,
          ...tweet.toJSON()
        }))
        res.render('tweets', { user, tweets })})   
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = req.user.id
    if (!description) throw new Error('內容不可空白')
    return Tweet.create({
      UserId,
      description
    })
      .then(() => res.redirect('/tweets'))
      .catch(err => next(err))
  }
}

module.exports = tweetController