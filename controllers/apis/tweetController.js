const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const moment = require('moment');
const tweetService = require('../../services/tweetService')

const tweetController = {

  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },

  getTenTweets: (req, res) => {
    console.log('req.params', req.params)
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']],
      limit: 10,
      offset: Number(req.params.tweetsCount),
      raw: true,
      nest: true,
    })
      .then(tweet => {
        console.log('tweet.length', tweet.length)
        for (let i = 0; i < tweet.length; i++) {
          tweet[i].description = subText(tweet[i].description)
          tweet[i].updatedAt = moment(tweet[i].updatedAt).fromNow(true)
        }
        return res.json(tweet)
      })
  },

}

module.exports = tweetController

function subText(content, num) {
  let count = Number(num) ? Number(num) : 50;
  if (content.length < count) {
    return content;
  }
  return content.substring(0, count) + '...';
}