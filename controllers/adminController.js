const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply

const maxDescLen = 50

const adminController = {
  // 載入登入頁
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // 登入跳轉
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  // 列出所有tweets，需處理tweets內容，超出maxDescLen字數則擷取maxDescLen字數並於後方加上"..."
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC'], // Sorts by createdAt in descending order
      ],
    })

    tweets.map(tweet => {
      tweet.description = tweet.description.length <= maxDescLen ? tweet.description : tweet.description.substring(0, maxDescLen) + "..."
    })

    return res.render('admin/tweets', { tweets })
  },

  // 刪除單一tweet
  deleteTweet: async (req, res) => {
    const TweetID = req.params.id

    // await Like.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(likes => {
    //   console.log("===============")
    //   console.log("likes before:", likes)
    // })

    // await Reply.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(replies => {
    //   console.log("===============")
    //   console.log("reply before:", replies)
    // })

    // await Tweet.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { id: TweetID }
    // }).then(tweets => {
    //   console.log("===============")
    //   console.log("tweet before:", tweets)
    // })

    await Like.destroy({ where: { TweetID } })
    // await Reply.destroy({ where: { TweetID } })
    await Tweet.destroy({ where: { id: TweetID } })

    // await Like.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(likes => {
    //   console.log("===============")
    //   console.log("likes after:", likes)
    // })

    // await Reply.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(replies => {
    //   console.log("===============")
    //   console.log("reply after:", replies)
    // })

    // await Tweet.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { id: TweetID }
    // }).then(tweets => {
    //   console.log("===============")
    //   console.log("tweet after:", tweets)
    // })

    res.redirect('/admin/tweets')
  }
}

module.exports = adminController