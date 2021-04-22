const { Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {

      tweets = tweets.map((d, i) => ({
        ...d.dataValues
      }))

      const pageTitle = '首頁'
      const isUserPage = true;

      res.render('tweets', { tweets, pageTitle, isUserPage })
    })
      .catch(e => {
        console.warn(e)
      })
  }
}

module.exports = tweetController