const helpers = require('../_helpers')
const errorHandler = require('./errors-helpers')
const { Op } = require('sequelize')
const { Tweet, User, sequelize } = require('../models')

const followingUsersTweets = async req => {
  return await Tweet.findAll({
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
}

const isValidWordsLength = (text, len, next) => {
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
}
module.exports = { followingUsersTweets, isValidWordsLength }
