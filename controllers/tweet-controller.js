const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => { // 進入推文清單
    const id = 1
    return Promise.all([
      User.findByPk(id),
      Tweet.findAll({
        include: User,
        raw: true,
        nest: true,
        order: [['createdAt', "desc"]],
        limit: 5
      })
    ])
      .then(([user, tweets]) => {
        res.render('tweets', { user: user.toJSON(), tweets })
      })
      .catch(err => console.log(err))
  },
  getTweet: (req, res, next) => { // 登入使用者頁面顯示個人推文清單
    const { id } = req.params
    return Tweet.findByPk(id, {
      include: [
        User,
        { model: Reply, include: User }
      ]
    })
      .then(tweet => {
        tweet = tweet.toJSON()
        res.render('tweet', { tweet })
      })
      .catch(err => console.log(err))
  }
}

module.exports = tweetController