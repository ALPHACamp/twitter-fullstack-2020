const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship

const maxDescLen = 50

const adminService = {
  getTweets: async (req, res, callback) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC'], // Sorts by createdAt in descending order
      ],
    })

    return tweets.map(tweet => {
      tweet.description = tweet.description.length <= maxDescLen ? tweet.description : tweet.description.substring(0, maxDescLen) + "..."
    }).then(tweets => {
      callback({ tweets: tweets })
    })
  }
}

module.exports = adminService