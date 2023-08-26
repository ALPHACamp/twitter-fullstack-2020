const { User, sequelize } = require('../../models')
const { topFollowedUser } = require('../../helpers/recommand-followship-helper')
const { followingUsersTweets } = require('../../helpers/tweets-helper')
const INPUT_LENGTH_JS = 'inputLength.js'
const USER_PAGE_JS = 'userPage.js'
const TWEET_LINK_JS = 'tweetLink.js'

const tweetController = {

  /* user home page */
  getTweets: async (req, res, next) => {
    try {
      const javascripts = [TWEET_LINK_JS]
      const [tweets, recommendUser] = await Promise.all([
        followingUsersTweets(req),
        topFollowedUser(req) // 給右邊的渲染用
      ])
      return res.render('main/tweets', {
        tweets,
        recommendUser,
        javascripts,
        route: 'home'
      })
    } catch (error) {
      return next(error)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const id = req.params.id
      const javascripts = [TWEET_LINK_JS]
      const [recommendUser] = await Promise.all([
        topFollowedUser(req) // 給右邊的渲染用
      ])
      return res.render('main/replies', {
        id,
        recommendUser,
        javascripts,
        route: 'home'
      })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = tweetController
