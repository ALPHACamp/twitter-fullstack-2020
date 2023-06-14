const { User, Followship, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const nav = 'tweets'
const tweetsController = {
  getTweets: async (req, res, next) => {
    // 取得登入使用者的資料
    const loginUser = helpers.getUser(req)
    const { followingData } = req
    try {
      let tweets = await Tweet.findAll({
        include: [User, { model: Like }, { model: Reply, include: User }],
        order: [['createdAt', 'DESC']]
      })
      tweets = tweets.map(tweet => ({
        likesCount: tweet.Likes.length,
        repliesCount: tweet.Replies.length,
        ...tweet.toJSON(),
        isLiked: loginUser && loginUser.Likes && loginUser.Likes.some(like => like.TweetId === tweet.id)
      }))
      const partialName = 'tweets'
      return res.render('index', {
        user: loginUser,
        tweets: tweets,
        partialName,
        // nav,
        followingData
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const { tweetId } = req.params
    const user = helpers.getUser(req)
    const { followingData } = req
    try {
      const tweet = await Tweet.findByPk(tweetId, {
        include: [User, { model: Like }, { model: Reply, include: User }]
      })
      const likesCount = tweet.Likes.length
      const repliesCount = tweet.Replies.length
      const isLiked = tweet.Likes.some(l => l.dataValues.UserId === user.id)
      // 按照發文順序顯示
      tweet.Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)
      const partialName = 'tweet'
      res.render('index', {
        tweet: tweet.toJSON(),
        user,
        likesCount,
        repliesCount,
        isLiked,
        partialName,
        nav,
        followingData
      })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    let { description } = req.body
    const UserId = helpers.getUser(req).id
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
  },
  postReply: async (req, res, next) => {
    let { comment } = req.body
    const TweetId = req.params.tweetId
    const UserId = helpers.getUser(req).id
    // 修剪回覆內容去掉前後空白
    comment = comment.trim()
    try {
      if (!comment) throw new Error('回覆內容不能為空白!')
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetsController
