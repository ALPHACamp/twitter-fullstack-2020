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

      const tweets = await followingUsersTweets(req)

      if (!tweets) {
        throw new errorHandler.TweetError('Can not fount any tweet')
      }

      const recommendUser = await topFollowedUser(req) // 給右邊的渲染用

      if (!recommendUser) {
        throw new errorHandler.TweetError('Can not fount any recomend users')
      }

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
      const description = req.body.description.trim()

      if (!description.length) {
        throw new errorHandler.TweetError('內容不可空白')
      } else if (description.length > MAX_TWEET_LENGTH) {
        throw new errorHandler.TweetError(`字數不可超過${MAX_TWEET_LENGTH}字`)
      }

      await Tweet.create({
        UserId: userId,
        description
      })

      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS]

      const recommendUser = await topFollowedUser(req) // 給右邊的渲染用

      if (!recommendUser) {
        throw new errorHandler.TweetError('Can not fount any recomend users')
      }

      const tweetWithReplies = await getTweetReplies(req)

      if (!tweetWithReplies) {
        throw new errorHandler.TweetError('Can not fount tweet')
      }
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

      const referer = req.get('Referer') || '/signin'
      res.redirect(referer) // 回到上一頁
    } catch (error) {
      return (next)
    }
  },
  postLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id

      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        throw new errorHandler.LikeError('Tweet did not exist!')
      }

      const like = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })

      if (like) {
        throw new errorHandler.LikeError('Already liked!')
      }

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

      if (!like) {
        throw new errorHandler.LikeError('Already unliked!')
      }

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
