const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')
const dayjs = require('dayjs')

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const userself = req.user
      const users = await User.findAll({// 撈出所有 User 與 followers 資料
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ]
      })
      let popularUser = []

      popularUser = users.map(user => ({ // 整理 users 資料
        ...user.dataValues,
        FollowerCount: user.Followers.length,// 計算追蹤者人數
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),// 判斷目前登入使用者是否已追蹤該 User 物件
      }))

      helpers.removeUser(popularUser, userself.id)//移除使用者自身資訊
      popularUser = popularUser.sort((a, b) => b.FollowerCount - a.FollowerCount)// 依追蹤者人數排序清單

      const tweets = await Tweet.findAll({
        include: [
          Reply,
          User,
          Like
        ],
        order: [['createdAt', 'DESC']]
      })
      const reorganizationTweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        userAvatar: tweet.User.avatar,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: req.user.LikedTweets.map(likeTweet => likeTweet.id).includes(tweet.id)
      }))
      return res.render('tweets', { reorganizationTweets, popularUser, userself })
    } catch(err) {
      console.warn(err)
    }
  }, 
  addTweet: async (req, res) => {
    try {
      const { description } = req.body
      if (!description) {
        req.flash('error_messages', '內文不可空白')
        return res.redirect('/tweets')
      }
      if (description.length > 140) {
        req.flash('error_messages', '內文不可超過140字')
        return res.redirect('/tweets')
      }
      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })
      return res.redirect('/tweets')
    } catch(err) {
      console.warn(err)
    }   
  },

  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [
          { model: Reply, include: [User] },
          User,
          Like
        ]
      })
      const tweetJson = tweet.toJSON()
      
      tweetJson.amPm = dayjs(`${tweetJson.createdAt}`).format('A') === 'PM' ? '下午' : '上午'
      tweetJson.hourMinute = dayjs(`${tweetJson.createdAt}`).format('HH:mm')
      tweetJson.year = dayjs(`${tweetJson.createdAt}`).format('YYYY')
      tweetJson.month = dayjs(`${tweetJson.createdAt}`).format('M')
      tweetJson.day = dayjs(`${tweetJson.createdAt}`).format('D')
      tweetJson.isLiked = req.user.LikedTweets.map(likeTweet => likeTweet.id).includes(tweetJson.id)
      const tweetReplies = tweetJson.Replies.map(reply => ({
        ...reply
      }))
      res.render('tweet', { tweetReplies, tweet: tweetJson })
    } catch(err) {
      console.warn(err)
    }
  }, 
  postReplies: async (req, res) => {
    try {
      const { comment } = req.body
      if (!comment) {
        req.flash('error_messages', '內文不可空白')
        return res.redirect('back')
      }
      const reply = await Reply.create({
        comment,
        UserId: req.user.id,
        TweetId: req.params.tweetId
      })
      return res.redirect(`/tweets/${req.params.tweetId}/replies`)
    } catch(err) {
      console.warn(err)
    }
    
  },

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: req.user.id,
        TweetId: req.params.tweetId
      })
      return res.json({status: 'success', message: 'add likes'})
    } catch(err) {
      console.warn(err)
    }
  }, 
  removeLike: async (req, res) =>{
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: req.params.tweetId
        }
      })
      await like.destroy()
      return res.json({ status: 'success', message: 'remove likes' })
    } catch(err) {
      console.warn(err)
    }
  }
}

module.exports = tweetController