const db = require('../models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const userController = {
  getUserTweets: async (req, res) => {
    try {
      const userId = req.params.userId
      const id = helpers.getUser(req).id
      const user = await User.findOne({
        where: { id: userId, role: 0 },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      user.dataValues.introduction =
        user.dataValues.introduction < 50
          ? user.dataValues.introduction
          : user.dataValues.introduction.substring(0, 50) + '...'
      user.dataValues.followerLength = user.Followers.length
      user.dataValues.followingLength = user.Followings.length
      user.dataValues.tweetLength = user.Tweets.length

      const tweetsRaw = await Tweet.findAll({
        where: { UserId: userId },
        include: [Reply, Like],
        order: [['createdAt', 'DESC']]
      })

      const tweets = tweetsRaw.map(tweet => ({
        ...tweet.dataValues,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length
      }))

      res.render('userTweets', {
        user: user.toJSON(),
        tweets,
        id
      })
    } catch (err) {
      console.log(err)
      req.flash('error_messages', '該使用者不存在')
      res.redirect('/tweets')
    }
  },
  getSetting: (req, res) => {},
  editSetting: (req, res) => {},
  getReplies: async (req, res) => {
    try {
      const userId = req.params.userId
      const id = helpers.getUser(req).id
      const user = await User.findOne({
        where: { id: userId, role: 0 },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      user.dataValues.introduction =
        user.dataValues.introduction < 50
          ? user.dataValues.introduction
          : user.dataValues.introduction.substring(0, 50) + '...'
      user.dataValues.followerLength = user.Followers.length
      user.dataValues.followingLength = user.Followings.length
      user.dataValues.tweetLength = user.Tweets.length

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      res.render('userReply', { user: user.toJSON(), replies, id })
    } catch (err) {
      console.log(err)
    }
  },
  getLikes: async (req, res) => {
    try {
      const userId = req.params.userId
      const id = helpers.getUser(req).id
      const user = await User.findOne({
        where: { id: userId, role: 0 },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      user.dataValues.introduction =
        user.dataValues.introduction < 50
          ? user.dataValues.introduction
          : user.dataValues.introduction.substring(0, 50) + '...'
      user.dataValues.followerLength = user.Followers.length
      user.dataValues.followingLength = user.Followings.length
      user.dataValues.tweetLength = user.Tweets.length

      const likedTweetsRaw = await Like.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            attributes: ['description', 'createdAt'],
            include: [
              User,
              { model: Like, attributes: ['id'] },
              { model: Reply, attributes: ['id'] }
            ],
            order: [['createdAt', 'DESC']]
          }
        ]
      })

      const likedTweets = likedTweetsRaw.map(like => ({
        ...like.dataValues,
        replyLength: like.Tweet.Replies.length,
        likeLength: like.Tweet.Likes.length
      }))

      res.render('userLike', { user: user.toJSON(), likedTweets, id })
    } catch (err) {
      console.log(err)
    }
  },
  
  getFollowings: async (req, res) => {
    try {
      const userself = req.user
      const users = await User.findAll({// 撈出所有 User 與 followers 資料
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      let user = []

      user = users.map(user => ({
        // 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length, // 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id) // 判斷目前登入使用者是否已追蹤該 User 物件
      }))

      helpers.removeUser(user, userself.id)//移除使用者自身資訊
      user = user.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      return res.render('following', { user, userself })
    }
    catch (err) {
      console.log(err)
      console.log('getUserFollowers err')
      return res.redirect('back')
    }
  },

  getFollowers: async (req, res) => {
    try {
      const userself = req.user
      const users = await User.findAll({// 撈出所有 User 與 followers 資料
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      let user = []

      user = users.map(user => ({
        // 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length, // 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id) // 判斷目前登入使用者是否已追蹤該 User 物件
      }))
      helpers.removeUser(user, userself.id)//移除使用者自身資訊
      user = user.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      const followers = await Followship.findAll({
        //依追蹤時間排序追蹤者
        raw: true,
        nest: true,
        where: {
          followingId: req.user.id
        },
        order: [['createdAt', 'DESC']]
      })

      let Data = []

      Data = followers.map(async (item, index) => {
        // 整理 followers 資料
        let user = await User.findByPk(item.followerId)
        user = user.dataValues
        isFollowed = req.user.Followings.map(d => d.id).includes(user.id) // 判斷目前登入使用者是否已追蹤該 User 物件
        return {
          ...item.user,
          user,
          isFollowed
        }
      })


      Promise.all(Data).then(data => {
        return res.render('follower', { user, data, userself })
      })
    } catch (err) {
      console.log(err)
      console.log('getUserFollowers err')
      return res.redirect('back')
    }
  }
}

module.exports = userController
