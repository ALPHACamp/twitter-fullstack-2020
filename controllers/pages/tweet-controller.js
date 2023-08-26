const { User, sequelize } = require('../../models')
const { topFollowedUser } = require('../../helpers/recommand-followship-helper')
const { followingUsersTweets } = require('../../helpers/tweets-helper')
const tweetController = {

  /* user home page */
  getUserTweets: async (req, res, next) => {
    try {
      const [tweets, recommendUser] = await Promise.all([
        followingUsersTweets(req),
        topFollowedUser(req) // 給右邊的渲染用
      ])
      return res.render('main/tweets', { tweets, recommendUser })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = tweetController
