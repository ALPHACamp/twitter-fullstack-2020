const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like


const tweetController = {
  getTweets: async(req, res) => {
    const tweets = await Tweet.findAll({  
      raw: true,
      nest: true,
      include: User
    })
    // console.log(tweets)
    return res.render('main',{ tweets})

    // return res.render('main')
  }
}


module.exports = tweetController