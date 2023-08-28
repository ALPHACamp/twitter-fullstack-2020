const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const tweetRoute = true
    const currentUser = helper.getUser(req)
    return Promise.all([
      Tweet.findAll({
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']]
      }),
      Reply.findAll({
        raw: true,
        nest: true
      })
    ])
      .then(([tweets, replies]) => {
        const replyTweetId = []
        const replyCounts = {}
        if (!tweets) throw new Error('Tweets do not exist!')
        return Promise.all([
          // 計算留言總數
          // 1. 將 tweetId 推入 replyTweetId 中
          replies.forEach(reply => {
            replyTweetId.push(reply.TweetId)
          })
        ])
          .then(() => {
            // 2. 計算每個 tweetId 各自的總數
            replyTweetId.forEach(item => {
              replyCounts[item] = replyCounts[item] ? replyCounts[item] + 1 : 1
            })
            return replyCounts
          })
          .then(replyCounts => {
            const result = tweets.map(tweet => ({
              ...tweet,
              // 建立 tweetCount 參數把得出來的 reply 數塞進去
              // 這裡的 index 我覺得應該是 tweet.id - 1 但測出來是要用 tweet.id
              tweetCount: replyCounts[tweet.id]
            }))
            return result
          })
      })
      .then(result => {
        res.render('tweets', { tweets: result, tweetRoute, currentUser, id: helper.getUser(req).id })
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    let { description } = req.body
    const UserId = helper.getUser(req).id
    // 後端驗證
    try {
      // 推文字數不可超過140字
      if (description.length > 140) throw new Error('字數不可超過140字')

      // 修剪推文內容去掉前後空白
      description = description.trim()
      if (!description) throw new Error('內容不可空白')

      await Tweet.create({
        UserId,
        description
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
