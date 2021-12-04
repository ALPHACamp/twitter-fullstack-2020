const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const helpers = require('../_helpers')

const tweetController = {
  //前台推文清單
  getTweets: (req, res) => {
    Tweet.findAll({
      include: User
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description,
        userName: r.dataValues.User.name,
        accountName: r.dataValues.User.account,
        avatarImg: r.dataValues.User.avatar
      }))
      return res.render('Tweets', {
        tweets: data,
      })
    })
  }
}

module.exports = tweetController