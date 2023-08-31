const { User, Tweet } = require('../models')
const pagiHelper = require('../helpers/pagination-helper')
const { relativeTimeFromNow } = require('../helpers/handlebars-helpers')

const adminServices = {
  getTweets: async (limit = 10, page = 0) => {
    const offset = pagiHelper.getOffset(limit, page)
    const tweets = await Tweet.findAll({
      include: {
        model: User,
        required: true
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      offset,
      limit
    })

    return tweets.map(tweet => {
      tweet.createdAt = relativeTimeFromNow(tweet.createdAt)
      if (tweet.description.length > 50) {
        tweet.description = tweet.description.substring(0, 50) + '...'
      } else {
        tweet.description = tweet.description.substring(0, 50)
      }
      return tweet
    })
  }
}

module.exports = adminServices
