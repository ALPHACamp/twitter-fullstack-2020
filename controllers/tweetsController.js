const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship
const sequelize = db.sequelize

const tweetsController = {
  allTweets: async (req, res) => {
    try {
      // 取出所有推文 按照時間排序 包含推文作者以及按讚數
      const tweets = await Tweet.findAll({
        include: [
          { model: Like, as: 'likes', attributes: ['id'] },
          { model: Reply, as: 'replies', attributes: { exclude: ['comment', 'createdAt', 'updatedAt'] } },
          { model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }
        ],
        order: [['createdAt', 'DESC']]
      })
      // 這個sql query的結果，如果使用raw: true, nest: true會很難處理 直接處理也很困難 所以作了以下的轉換
      let sortTweets = JSON.stringify(tweets)
      sortTweets = JSON.parse(sortTweets)
      sortTweets = sortTweets.map(item => {
        return { ...item, likes: item.likes.length, replies: item.replies.length }
      })
      return res.render('userPage', { layout: 'main', sortTweets })
    }
    catch (error) {
      console.log(error)
    }
  },

  getTop10Twitters: async (req, res) => {
    const userId = req.params.id
    try {
      const topTwitters = await Followship.findAll({
        attributes: ['followingId', [sequelize.fn('count', sequelize.col('followerId')), 'count']],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10,
        include: [{ model: User, as: 'following', attributes: ['name', 'avatar', 'account'] }],
      })

      let userFollowingList = await Followship.findAll({
        where: { followerId: { [Op.eq]: userId } },
        attributes: ['followingId']
      })

      userFollowingList = userFollowingList.map(item => {
        return item.followingId
      })

      res.json({ topTwitters, userFollowingList })
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = tweetsController