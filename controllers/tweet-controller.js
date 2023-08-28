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
  }, 
  postReply: (req, res, next) => {
    const { comment, TweetId } = req.body
    const UserId = req.user.id
    if (!comment) throw new Error('內容不可空白')
    return Promise.all([
      Tweet.findByPk(TweetId),
      User.findByPk(UserId)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!user) throw new Error ('使用者不存在') 
        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    res.render('tweet')
  }
}

module.exports = tweetController