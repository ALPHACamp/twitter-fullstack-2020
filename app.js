const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const helpers = require('./_helpers');
const db = require('./models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/tweets', (req, res) => {
  Tweet.findAll({
    include: [
      User,
      Like,
      Reply
    ],
    order: [['createdAt', 'DESC']]
  })
  .then(tweets => {
    console.log(tweets[0])
    console.log(tweets[0].dataValues.User.dataValues)
    tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes ? tweet.dataValues.Likes.length : 0,
        repliesCount: tweet.dataValues.Replies ? tweet.dataValues.Replies.length : 0,
    }))
    // console.log(tweets[0])
  })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
