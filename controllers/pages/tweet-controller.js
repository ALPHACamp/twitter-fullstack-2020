const { Tweet, Reply, Like } = require('../../models')
const userService = require('../../service/user-services')
const { CustomError } = require('../../libs/error/custom-error')
const helpers = require('../../_helpers')
const tweetServices = require('../../service/tweet-services')
const MAX_TWEET_LENGTH = 140
const TWEET_MODAL_JS = 'tweetModal.js'
const LOAD_TWEET_JS = 'unlimitScrolldown/loadTweet.js'
const LOAD_REPLY_JS = 'unlimitScrolldown/loadReply.js'

const tweetController = {
  /* user home page */
  getTweets: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS, LOAD_TWEET_JS]
      const limit = 12
      const page = 0
      const userId = helpers.getUser(req).id
      const tweets = await tweetServices.followingUsersTweets(userId, { limit, page })

      if (!tweets) {
        throw new CustomError('Can not fount any tweet', 'NotFoundError')
      }

      const recommendUser = await userService.topFollowedUser(userId) // 給右邊的渲染用

      if (!recommendUser) {
        throw new CustomError('Can not fount any recomend users', 'NotFoundError')
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
  getTweetsUnload: async (req, res, next) => {
    try {
      const { limit, page } = req
      const userId = helpers.getUser(req).id
      const tweetsUnload = await tweetServices.followingUsersTweets(userId, { limit, page })

      if (!tweetsUnload) {
        return res.json({ message: 'error', data: {} })
      }

      return res.json({ message: 'success', data: tweetsUnload })
    } catch (error) {
      return next(error)
    }
  },

  postTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const description = req.body.description.trim()

      if (!description.length) {
        throw new CustomError('內容不可空白', 'ValidateError')
      } else if (description.length > MAX_TWEET_LENGTH) {
        throw new RangeError(`字數不可超過${MAX_TWEET_LENGTH}字`)
      }

      await Tweet.create({
        UserId: userId,
        description
      })

      req.flash('success_messages', '推文發送成功')

      const referer = req.get('Referer') || '/signin'
      return res.redirect(referer) // 回到上一頁
    } catch (error) {
      return next(error)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS, LOAD_REPLY_JS]
      const limit = 8
      const page = 0

      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const recommendUser = await userService.topFollowedUser(userId) // 給右邊的渲染用

      if (!recommendUser) {
        throw new CustomError('Can not fount any recommend users', 'NotFoundError')
      }

      const tweetWithReplies = await tweetServices.getTweetReplies(userId, tweetId, { limit, page })

      if (!tweetWithReplies) {
        throw new CustomError('Can not fount tweet', 'NotFoundError')
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

  getRepliesUnload: async (req, res, next) => {
    try {
      const { limit, page } = req
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const tweetWithReplies = await tweetServices.getTweetReplies(userId, tweetId, { limit, page })

      if (!tweetWithReplies) {
        return res.json({ message: 'error', data: {} })
      }

      return res.json({ message: 'success', data: tweetWithReplies })
    } catch (error) {
      return next(error)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const comment = req.body?.comment.trim()

      tweetServices.isValidWordsLength(comment, MAX_TWEET_LENGTH, next)
      await Reply.create({
        UserId: userId,
        TweetId: tweetId,
        comment
      })

      req.flash('success_messages', '回覆成功')

      const referer = req.get('Referer') || '/signin'
      return res.redirect(referer) // 回到上一頁
    } catch (error) {
      return (next)
    }
  },

  postLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id

      const tweet = await Tweet.findByPk(tweetId,
        {
          attrbutes: ['id'],
          raw: true
        }
      )

      if (!tweet) {
        throw new CustomError('Tweet did not exist!', 'NotFoundError')
      }

      const like = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })

      if (like) {
        throw new CustomError('Already liked!', 'DuplicateError')
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
        throw new CustomError('Already unliked!', 'DuplicateError')
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
