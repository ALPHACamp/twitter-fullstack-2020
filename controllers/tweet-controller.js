const { User, Tweet, Reply, Like } = require('../models')

const tweetController = {
  getTweets: (req, res) => {
    const user = req.user
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like],
      nest: true
    })
      .then(tweets => {
        const likedTweetsId = req.user && req.user.LikedTweets.map(t => t.id)
        tweets = tweets.map(tweet => ({
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          isLiked: likedTweetsId.includes(tweet.id),
          ...tweet.toJSON()
        }))
        res.render('tweets', { user, tweets, UserId: user.id})})   
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = req.user.id
    if (!description) throw new Error('內容不可空白')
    return Tweet.create({
      UserId,
      description
    })
      .then(() => res.redirect('/tweets'))
      .catch(err => next(err))
  }, 
  postReply: (req, res, next) => {
    const { comment, TweetId } = req.body
    const UserId = req.user.id
    if (!comment) throw new Error('內容不可空白')
    return Promise.all([
      Tweet.findByPk(TweetId),
      User.findByPk(UserId)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!user) throw new Error ('使用者不存在') 
        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const TweetId = req.params.id
    const user = req.user
    return Promise.all([
      Tweet.findByPk(TweetId, {
        include: [
          User, 
          { model: User, as: 'LikedUsers'}
        ],
        nest: true
      }),
      Reply.findAndCountAll({
        where: {
          TweetId
        },
        order: [['createdAt', 'DESC']],
        include: User,
        nest: true,
        raw: true
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('推文不存在')
        const replyCount = replies.count
        const likeCount = tweet.LikedUsers.length
        const isLiked = tweet.LikedUsers.some(u => u.id === req.user.id)
        res.render('tweet', {
          user,
          tweet: tweet.toJSON(), 
          replies: replies.rows, 
          replyCount,
          likeCount,
          isLiked     
        })
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = req.user.id
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
        if (like) throw new Error('已點過喜歡')
        return Like.create({
          TweetId,
          UserId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = req.user.id
    return Like.findOne({
      where: {
        TweetId,
        UserId
      }
    })
      .then(like => {
        if (!like) throw new Error('未點過喜歡')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = tweetController