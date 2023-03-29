const { User, Tweet, reply, Followship, Like } = require('../models')
const helpers = require('../_helpers')

const tweetServices = {
  getLikeCount: async (req, cb) => {
    const tweetId = req.params.id
    try {
      const tweet = await Tweet.findByPk(tweetId, {
        include: {
          model: User,
          as: 'LikedUsers'
        }
      })
      const likeCount = tweet.LikedUsers.length
      return cb(null, likeCount)
    } catch (error) {
      cb(error)
    }
  },
}

module.exports = tweetServices