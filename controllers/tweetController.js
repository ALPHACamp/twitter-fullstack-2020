const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const userService = require('../services/userService')

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const popularUser = await userService.getPopular(req, res)

      const tweets = await Tweet.findAll({
        include: [Reply, User, Like],
        order: [['createdAt', 'DESC']]
      })
      const reorganizationTweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        userAvatar: tweet.User.avatar,
        replyLength: tweet.Replies.length,
        likeLength: tweet.Likes.length,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map(likeTweet => likeTweet.id)
              .includes(tweet.id)
          : false
      }))
      return res.render('tweets', {status: (200), reorganizationTweets, popularUser })
    } catch (err) {
      res.status(302);
      console.log('getTweets err')
      req.flash('error_messages', '讀取貼文串失敗！')
      return res.redirect('back')
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
        UserId: helpers.getUser(req).id
      })
      res.status(200)
      return res.redirect('/tweets')
    } catch (err) {
      res.status(302);
      console.log('addTweet err')
      req.flash('error_messages', '新增留言失敗！')
      return res.redirect('back')
    }
  },
  getTweet: async (req, res) => {
    try {
      const popularUser = await userService.getPopular(req, res)
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [{ model: Reply, include: [User] }, User, Like]
      })
      const tweetJson = tweet.toJSON()

      tweetJson.amPm =
        dayjs(`${tweetJson.createdAt}`).format('A') === 'PM' ? '下午' : '上午'
      tweetJson.hourMinute = dayjs(`${tweetJson.createdAt}`).format('HH:mm')
      tweetJson.year = dayjs(`${tweetJson.createdAt}`).format('YYYY')
      tweetJson.month = dayjs(`${tweetJson.createdAt}`).format('M')
      tweetJson.day = dayjs(`${tweetJson.createdAt}`).format('D')
      tweetJson.isLiked = helpers.getUser(req).LikedTweets
        ? helpers
            .getUser(req)
            .LikedTweets.map(likeTweet => likeTweet.id)
            .includes(tweetJson.id)
        : false
      let tweetReplies = tweetJson.Replies.map(reply => ({
        ...reply
      }))
      // 增加排序，目前無規定，故先以時間最新排越前面
      tweetReplies = tweetReplies.sort((a, b) => b.id - a.id)
      res.render('tweet', {status: (200), tweetReplies, tweet: tweetJson, popularUser })
    } catch (err) {
      res.status(302);
      console.log('getTweet err')
      req.flash('error_messages', '讀取貼文失敗')
      return res.redirect('back')
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
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      })
      res.status(200)
      return res.redirect(`/tweets/${req.params.tweetId}/replies`)
    } catch (err) {
      res.status(302)
      console.log('postReplies err')
      req.flash('error_messages', '留言失敗')
      return res.redirect('back')
    }
  },
  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      })
      return res.redirect('back')
    } catch (err) {
      res.status(302);
      console.log('addLike err')
      req.flash('error_messages', '點擊失敗')
      return res.redirect('back')
    }
  },
  removeLike: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.tweetId)

      await Like.destroy({ where: { UserId, TweetId } })

      return res.redirect('back')

    } catch (err) {
      res.status(302);
      console.log('removeLike err')
      req.flash('error_messages', '點擊失敗')
      return res.redirect('back')
    }
  }
}

module.exports = tweetController
