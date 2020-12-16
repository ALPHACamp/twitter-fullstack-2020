const db = require('../models')
const { User, Tweet, Reply, Like } = db


module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/admin/tweets', (req, res) => {
    Tweet.findAll({
      include: [User], order: [['createdAt', 'DESC']]
    }).then(tweets => {
      console.log(tweets)
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        description: tweet.dataValues.description.substring(0, 50),
      }))
      return res.render('admin/tweets', { tweets: tweets })
    }
    )
  })
}
