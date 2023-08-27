const { Tweet, Like } = require('../../models')
const { topFollowedUser } = require('../../helpers/recommand-followship-helper')
const { followingUsersTweets } = require('../../helpers/tweets-helper')
const errorHandler = require('../../helpers/errors-helpers')
const helpers = require('../../_helpers')
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
  postTweets: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    const text = req.body.tweet
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
  },
  postLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            UserId: userId,
            TweetId: tweetId
          }
        })
      ])
      if (!tweet) throw new errorHandler.LikeError('Tweet did not exist!')
      if (like) throw new errorHandler.LikeError('Already liked!')
      await Like.create({
        UserId: userId,
        TweetId: tweetId
      })
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const like = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })
      if (!like) throw new errorHandler.LikeError('Already unliked!')
      await like.destroy({
        UserId: userId,
        TweetId: tweetId
      })
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = tweetController
