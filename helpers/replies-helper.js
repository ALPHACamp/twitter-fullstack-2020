const helpers = require('../_helpers')
const { Tweet, User, Reply, sequelize } = require('../models')

const getTweetReplies = async req => {
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

module.exports = { getTweetReplies }
