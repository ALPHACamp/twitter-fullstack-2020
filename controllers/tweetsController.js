const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship
const sequelize = db.sequelize
const helpers = require('../_helpers')

const tweetsController = {
  allTweets: async (req, res) => {
    try {
      // 取出所有推文 按照時間排序 包含推文作者以及按讚數
      const tweets = await Tweet.findAll({
        include: [
          { model: Like, as: 'likes', attributes: ['UserId'] },
          { model: Reply, as: 'replies', attributes: ['UserId'] },
          { model: User, as: 'user', attributes: ['id', 'avatar', 'account', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      // 這個sql query的結果，如果使用raw: true, nest: true會很難處理 直接處理也很困難 所以作了以下的轉換
      let sortTweets = JSON.stringify(tweets)
      sortTweets = JSON.parse(sortTweets)
      sortTweets = sortTweets.map(item => {
        return { ...item, likesNum: item.likes.length, repliesNum: item.replies.length }
      })
      return res.render('userHomePage', { layout: 'main', sortTweets, to:'home' })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
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
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postTweet: async (req, res) => {
    try {
      if (req.body.description.length > 140) return
      const data = {}
      data.UserId = helpers.getUser(req).id
      data.description = req.body.description
      if (!req.body.description) {
        req.flash('error_messages', '內容不可為空')
        return res.redirect('back')
      }
      await Tweet.create({ ...data })

      return res.status(200).redirect('back')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postLike: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      await Like.findOrCreate({ where: { UserId, TweetId } })

      return res.status(302).redirect('back')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postUnlike: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const unlike = await Like.findOne({ where: { 
        [Op.and]: [
          { TweetId: { [Op.eq]: TweetId } },
          { UserId: { [Op.eq]: UserId } },
        ]
       } })

      if (unlike) {
        await unlike.destroy({
          where: {
            [Op.and]: [
              { TweetId: { [Op.eq]: TweetId } },
              { UserId: { [Op.eq]: UserId } },
            ]
          }
        })

        return res.status(302).redirect('back')
      } else {
        req.flash('error_messages', '操作失敗')
        return res.redirect('back')
      }
    }
    catch (error) {
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postTweetReply: async (req, res) => {
    try {
      const data = {}
      data.UserId = helpers.getUser(req).id
      data.TweetId = req.params.id
      data.comment = req.body.comment
      await Reply.create({ ...data })

      return res.status(200).redirect('back')
    }
    catch (error) {
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  getTweetReplies: async (req, res) => {
    try {
      const tweetId = Number(req.params.id)
      const reply = await Tweet.findOne({
        where: { id: { [Op.eq]: tweetId } },
        include: [
          { model: User, as: 'user', attributes: ['avatar', 'account', 'name'] },
          { model: Reply, as: 'replies', attributes: ['comment', 'createdAt'], include: [{ model: User, as: 'user', attributes: ['id', 'avatar', 'account', 'name'] }] },
          { model: Like, as: 'likes', attributes: ['UserId'] },
        ]
      })
      let replies = JSON.stringify(reply)
      replies = JSON.parse(replies)
      res.status(200).render('commentPage', { layout: 'main', replies })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = tweetsController