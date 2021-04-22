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
  },
  getTweet: (req, res) => {
    const tweet_id = req.params.id

    Tweet.findOne(
      {
        where: { id: tweet_id },
        include: [Reply]
      }
    ).then((tweet) => {

      // console.log(tweet.Replies)
      const pageTitle = '推文'

      res.render('tweet', { tweet: tweet.toJSON(), pageTitle })
    })
      .catch(e => {
        console.warn(e)
      })
  }
}

module.exports = tweetController