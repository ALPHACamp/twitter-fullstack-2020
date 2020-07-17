const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getHomePage: (req, res) => {
    // 顯示已追蹤人的tweets
    Tweet
      .findAll({ where: { userId: 1 }, raw: true, nest: true, include: [User] })
      .then((tweets) => {
        console.log(tweets)
        res.render('home', { tweets: tweets })
      })
      .catch(err => res.send(err))
    // 尚未完成: 推薦追蹤名單
  },
  // createTweet: (req, res) => {

  // } 
}

module.exports = tweetController