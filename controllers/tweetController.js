<<<<<<< HEAD
const tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
=======
const { Tweet } = require('../models')

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
    })

    return res.render('tweets', { tweets })
>>>>>>> 93b3d49a85013a532470942ad0f9bc3fdcb453ec
  }
}

module.exports = tweetController