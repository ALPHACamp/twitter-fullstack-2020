const { Tweet, User, Reply, Like } = require('../../models')
const helpers = require('../../_helpers')
const dayjs = require('dayjs')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetsData = tweets.map(t => ({
          ...t.toJSON(),
          replyCounts: t.Replies.length,
          likeCounts: t.Likes.length,
          isLiked: req.user?.Likes.some(l => l.TweetId === t.id)
        }))
        res.render('tweets', { tweetsData })
      })
      .catch(err => next(err))
  },
  addTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不可超過140字')
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功發布推文')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (like) throw new Error('你已經按過愛心了')

        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  deleteLike: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error('你還未按愛心')

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId, {
      include: [
        User,
        { model: Reply, include: [User, { model: Tweet, include: [User] }] },
        Like],
      order: [[Reply, 'createdAt', 'DESC']]
    })
      .then(tweet => {
        tweet = tweet.toJSON()
        tweet.period = dayjs(`${tweet.createdAt}`).format('A') === 'AM' ? '上午' : '下午'
        tweet.time = dayjs(`${tweet.createdAt}`).format('h:mm')
        tweet.date = dayjs(`${tweet.createdAt}`).format('YYYY年M月DD')
        tweet.replyCounts = tweet.Replies.length
        tweet.likeCounts = tweet.Likes.length
        tweet.isLiked = req.user?.Likes.some(l => l.TweetId === tweet.id)
        tweet.replies = tweet.Replies.map(reply => ({
          ...reply
        }))
        res.render('tweet', { tweet })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
