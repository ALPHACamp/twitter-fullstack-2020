const db = require('../models')
const Tweet = db.Tweet
const helpers = require('../_helpers') 

let tweetService = {
  postTweets: (req, res, callback) => {
    if (!req.body.description) {
      return callback({status:'error', message:"請輸入貼文內容"})
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    })
      .then((tweet) => {
        callback({status:'success', message:'tweet was successfully created'})
      })
  },
}

module.exports = tweetService