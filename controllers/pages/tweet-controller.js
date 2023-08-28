const { Tweet, Reply, Like } = require('../../models')
const { topFollowedUser } = require('../../helpers/recommand-followship-helper')
const { followingUsersTweets, isValidWordsLength } = require('../../helpers/tweets-helper')
const { getTweetReplies } = require('../../helpers/replies-helper')
const errorHandler = require('../../helpers/errors-helpers')
const helpers = require('../../_helpers')
const MAX_TWEET_LENGTH = 140
const TWEET_MODAL_JS = 'tweetModal.js'

const tweetController = {

  /* user home page */
  getTweets: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS]
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
    try {
      const userId = helpers.getUser(req).id
      const description = req.body?.description.trim()
      isValidWordsLength(description, MAX_TWEET_LENGTH, next)
      await Tweet.create({
        UserId: userId,
        description
      })
      return res.redirect('back')
    } catch (error) {
      return (next)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS]
      const [recommendUser, tweetWithReplies] = await Promise.all([
        topFollowedUser(req), // 給右邊的渲染用
        getTweetReplies(req)
      ])
      // console.log('#tweet-contoller #L54 tweetWithRepies:', tweetWithReplies)
      return res.render('main/replies', {
        tweetWithReplies,
        recommendUser,
        javascripts,
        route: 'home'
      })
    } catch (error) {
      return next(error)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const comment = req.body?.comment.trim()
      isValidWordsLength(comment, MAX_TWEET_LENGTH, next)
      await Reply.create({
        UserId: userId,
        TweetId: tweetId,
        comment
      })
      return res.redirect('back')
    } catch (error) {
      return (next)
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
