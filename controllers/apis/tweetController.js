

const tweetService = require('../../services/tweetService')

const tweetController = {



  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },


}

module.exports = tweetController