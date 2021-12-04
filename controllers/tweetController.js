const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User, Like, Reply],
      order: [['createdAt', 'DESC']],
    }).then(async (tweets) => {
      //計算 該則 tweet 被其他使用者喜歡或 有留言的次數
      //決定 tweets.handlebar 上的 留言跟喜歡按鈕是要實心或空心
      tweets = tweets.map((tweet) => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes ? tweet.dataValues.Likes.length : 0,
        repliesCount: tweet.dataValues.Replies ? tweet.dataValues.Replies.length : 0,
        isLiked: tweet.dataValues.Likes.map((d) => d.dataValues.UserId).includes(req.user.id),
        isReplied: tweet.dataValues.Replies.map((d) => d.dataValues.UserId).includes(req.user.id),
      }))
      // 取得右邊欄位的Top users
      const topUsers = await helpers.getTopuser(req.user)
      // console.log(topUsers)
      // console.log(tweets[0])
      return res.render('tweets', {
        tweets: tweets,
        users: topUsers,
      })
    })
  },
  getTweet: (req, res) => {
    const tweetId = req.params.id
    // console.log('****tweetId******', tweetId)

    Tweet.findByPk(tweetId, {
      include: [{ model: User, as: 'LikedUsers' }, { model: Reply, order: [['createdAt', 'DESC']], include: [User] }, User],
    }).then(async (tweet) => {
      // console.log(req.user)
      // console.log(tweet)
      tweet = {
        ...tweet.dataValues,
        likesCount: tweet.dataValues.LikedUsers ? tweet.dataValues.LikedUsers.length : 0,
        repliesCount: tweet.dataValues.Replies ? tweet.dataValues.Replies.length : 0,

        // 目前登入者是否留過言或喜歡, 如果有就把留言或喜歡符號實心
        isLiked: tweet.dataValues.LikedUsers.map((d) => d.dataValues.id).includes(req.user.id),
        isReplied: tweet.dataValues.Replies.map((d) => d.dataValues.UserId).includes(req.user.id),
      }
      // 取得右邊欄位的Top users
      const topUsers = await helpers.getTopuser(req.user)
      // console.log(tweet.Replies[0].dataValues)
      // console.log(tweet.LikedUsers)
      // console.log(tweet.LikedUsers[0].dataValues)
      // console.log(tweet.LikedUsers[1].dataValues)
      // console.log(tweet.LikedUsers[3].dataValues)
      console.log(tweet)
      return res.render('tweet', {
        tweet: tweet,
        users: topUsers,
      })
    })
  },
}

module.exports = tweetController
