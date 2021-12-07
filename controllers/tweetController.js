const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helpers = require('../_helpers')

const tweetController = {
  //前台推文清單
  getTweets: (req, res) => {
    Tweet.findAll({
      row: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: User
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description,
        userName: r.dataValues.User.name,
        accountName: r.dataValues.User.account,
        avatarImg: r.dataValues.User.avatar,
      }))
      return res.render('tweets', {
        tweets: data,
        user: req.user
      })
    })
  },
  //前台瀏覽個別推文
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      return res.render('tweet', {
        tweet: tweet.toJSON()
      })
    })
  }
}

module.exports = tweetController