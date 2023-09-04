const { User, Tweet, Reply, sequelize } = require('../models')
// const { Op } = require('sequelize')
const { CustomError } = require('../libs/error/custom-error')
const helpers = require('../_helpers')
const pagiHelper = require('../helpers/pagination-helpers')
const { relativeTimeFromNow } = require('../helpers/handlebars-helpers')
const tweetServices = {
  followingUsersTweets: async (userId, { limit = 9, page = 0 } = {}) => {
    const offset = pagiHelper.getOffset(limit, page)
    const tweets = await Tweet.findAll({
      /// ////以下區塊可實現僅取出自己與跟隨者的tweets, 因user story規定，暫時註解////////////
      // where: {
      //   [Op.or]: [
      //     {
      //       UserId: {
      //         [Op.in]: sequelize.literal(
      //         `(SELECT following_id FROM Followships
      //           WHERE Followships.follower_id = ${userId}
      //         )`)
      //       }
      //     },
      //     { UserId: { [Op.eq]: userId } } // 自己的也撈出來, 因為要過測試
      //   ]
      // },
      /// ////////////////////////////////////////////////////////////////////////////////////
      include: [User],
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replies'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${userId})`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      offset,
      limit
    })

    tweets.forEach(tweet => {
      tweet.createdFromNow = relativeTimeFromNow(tweet.createdAt)
    })

    return tweets
  },

  isValidWordsLength: (text, len, next) => {
    try {
      if (!text.length) {
        throw new CustomError('內容不可空白', 'ValidateError')
      }
      if (text.length > len) {
        throw new RangeError(`字數不可超過${len}字`)
      }
    } catch (error) {
      return next(error)
    }
  },

  getTweetReplies: async (userId, tweetId, { limit = 8, page = 0 } = {}) => {
    const offset = pagiHelper.getOffset(limit, page)
    let tweetWithRepies = await Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'], require: true },
        {
          model: Reply,
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
          require: true,
          offset,
          limit,
          order: [['createdAt', 'DESC']]
        }
      ],
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replies'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = ${tweetId} AND Likes.user_id = ${userId})`), 'isLiked']
        ]
      }
    })

    tweetWithRepies = tweetWithRepies.toJSON()
    tweetWithRepies.Replies.forEach(reply => {
      reply.createdFromNow = relativeTimeFromNow(reply.createdAt)
    })

    return tweetWithRepies
  }

}

module.exports = tweetServices
