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
      const UserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: [
          'id', 'description', 'createdAt', 
          [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.TweetId = Tweet.id)'), 'likesNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `replies` WHERE replies.TweetId = Tweet.id)'), 'repliesNum'],
          [sequelize.literal(`(SELECT likes.UserId FROM ${`likes`} WHERE likes.TweetId = Tweet.id AND likes.UserId = ${UserId})`), 'like'],
        ],
        include: [
          { model: User, as: 'user', attributes: ['id', 'avatar', 'account', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      const userInfo = await User.findOne({
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: UserId } },
        attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followerNum'],
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetNum']
        ]
      })
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }
      
      return res.render('userHomePage', { layout: 'main', tweets, userInfo, user, to:'home' })
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
      if (req.body.description.length > 140) {
        req.flash('error_messages', '不可超過140個字')
        return res.redirect('/tweets')
      }
      const data = {}
      data.UserId = helpers.getUser(req).id
      data.description = req.body.description
      if (!req.body.description) {
        req.flash('error_messages', '內容不可為空')
        return res.redirect('/tweets')
      }
      await Tweet.create({ ...data })

      return res.redirect('/tweets')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('/tweets')
    }
  },

  postLike: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      await Like.findOrCreate({ where: { UserId, TweetId } })

      return res.redirect('back')
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

        return res.redirect('back')
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
      if (req.body.comment.length > 140) {
        req.flash('error_messages', '不可超過140個字')
        return res.redirect('/tweets')
      }
      if (!req.body.comment) {
        req.flash('error_messages', '內容不可為空')
        return res.redirect('/tweets')
      }
      await Reply.create({ ...data })

      return res.redirect(`/tweets/${req.params.id}/replies`)
    }
    catch (error) {
      req.flash('error_messages', '操作失敗')
      return res.redirect(`/tweets/${req.params.id}/replies`)
    }
  },

  getTweetReplies: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const reply = await Tweet.findOne({
        raw: true,
        nest: true,
        plain: false,
        where: { id: { [Op.eq]: tweetId } },
        attributes: ['UserId',
        [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.TweetId = Tweet.id)'), 'likesNum'],
        [sequelize.literal('(SELECT COUNT(*) FROM `replies` WHERE replies.TweetId = Tweet.id)'), 'repliesNum']
        ],
        include: [
          { model: Reply, as: 'replies', attributes: ['comment', 'createdAt'], 
          include: [{ model: User, as: 'user', attributes: ['id', 'avatar', 'account',    'name'] }] },
        ]
      })
      let tweet = await Tweet.findOne(
      {
        raw: true,
        nest: true,
        where: { id: { [Op.eq]: tweetId } },
        attributes: ['id', 'UserId', 'description', 'createdAt',
          [sequelize.literal(`(SELECT UserId FROM ${`replies`} WHERE replies.TweetId = ${tweetId} AND replies.UserId = ${UserId} limit 1)`), 'reply'],
          [sequelize.literal(`(SELECT UserId FROM ${`likes`} WHERE likes.TweetId = ${tweetId} AND likes.UserId = ${UserId} limit 1)`), 'like']
        ],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'account', 'avatar']},
        ]
      })
      const user = {
        id: helpers.getUser(req).id,
        name: helpers.getUser(req).name,
        account: helpers.getUser(req).account,
        avatar: helpers.getUser(req).avatar,
        introduction: helpers.getUser(req).introduction,
        createdAt: helpers.getUser(req).createdAt
      }
      return res.render('commentPage', { layout: 'main', reply, tweet, userInfo: user })
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = tweetsController