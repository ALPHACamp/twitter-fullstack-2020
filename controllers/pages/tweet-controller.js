const { User, Tweet, Reply, Like, sequelize } = require('../../models')
const { Op } = require('sequelize')
const { userHelper } = require('./user-controller')
const errorHandler = require('../../helpers/errors-helpers')
const helpers = require('../../_helpers')

const MAX_TWEET_LENGTH = 140
const TWEET_MODAL_JS = 'tweetModal.js'

const tweetHelper = {
  followingUsersTweets: req => {
    return Tweet.findAll({
      where: {
        [Op.or]: [
          {
            UserId: {
              [Op.in]: sequelize.literal(
              `(SELECT following_id FROM Followships
                WHERE Followships.follower_id = ${helpers.getUser(req).id}
              )`)
            }
          },
          { UserId: { [Op.eq]: helpers.getUser(req).id } } // 自己的也撈出來, 因為要過測試
        ]
      },
      include: [User],
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replies'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${helpers.getUser(req).id})`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
  },

  isValidWordsLength: (text, len, next) => {
    try {
      if (!text.length) {
        throw new errorHandler.TweetError('內容不可空白')
      }
      if (text.length > len) {
        throw new errorHandler.TweetError(`字數不可超過${len}字`)
      }
    } catch (error) {
      return next(error)
    }
  },

  getTweetReplies: async req => {
    const tweetId = req.params.id
    const tweetWithRepies = await Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Reply, include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }] }
      ],
      order: [[Reply, 'createdAt', 'DESC']],
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replies'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = ${tweetId} AND Likes.user_id = ${helpers.getUser(req).id})`), 'isLiked']
        ]
      }
    })
    return tweetWithRepies.toJSON()
  }

}

const tweetController = {
  /* user home page */
  getTweets: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS]

      const tweets = await tweetHelper.followingUsersTweets(req)

      if (!tweets) {
        throw new errorHandler.TweetError('Can not fount any tweet')
      }

      const recommendUser = await userHelper.topFollowedUser(req) // 給右邊的渲染用

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

      req.flash('success_messages', '推文發送成功')

      const referer = req.get('Referer') || '/signin'
      return res.redirect(referer) // 回到上一頁
    } catch (error) {
      return next(error)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const javascripts = [TWEET_MODAL_JS]

      const recommendUser = await userHelper.topFollowedUser(req) // 給右邊的渲染用

      if (!recommendUser) {
        throw new errorHandler.TweetError('Can not fount any recomend users')
      }

      const tweetWithReplies = await tweetHelper.getTweetReplies(req)

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

      tweetHelper.isValidWordsLength(comment, MAX_TWEET_LENGTH, next)
      await Reply.create({
        UserId: userId,
        TweetId: tweetId,
        comment
      })

      req.flash('success_messages', '推文發送成功')

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
