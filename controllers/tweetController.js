const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {

    Tweet.findAll({
      //where: { UserId: req.user.id },
      raw: true,
      nest: true,
      include: [{ model: Like }]
    }).then(tweets => {
      console.log(tweets)
      return res.render('tweets', { tweets })
    })  
  }
}

module.exports = tweetController