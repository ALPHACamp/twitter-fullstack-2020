const { Tweet, User, Like, Reply } = require('../../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    const [tweets, likes, replies, users] = await Promise.all([
      Tweet.findAll({
        include: [User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({
        raw: true,
        nest: true
      }),
      Reply.findAll({
        raw: true,
        nest: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })])

    const usersSorted = users.map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: req.user && req.user.Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

    const likedTweetsId = []
    likes.forEach(like => {
      if (like.UserId === req.user.id) {
        likedTweetsId.push(like.TweetId)
      }
    })

    const tweetLikedMap = {}
    likes.forEach(like => {
      if (!tweetLikedMap[like.TweetId]) {
        tweetLikedMap[like.TweetId] = 1
      } else {
        tweetLikedMap[like.TweetId] = tweetLikedMap[like.TweetId] + 1
      }
    })

    const tweetRepliedMap = {}
    replies.forEach(reply => {
      if (!tweetRepliedMap[reply.TweetId]) {
        tweetRepliedMap[reply.TweetId] = 1
      } else {
        tweetRepliedMap[reply.TweetId] = tweetRepliedMap[reply.TweetId] + 1
      }
    })

    const data = tweets.map(r => ({
      ...r,
      isLiked: likedTweetsId.includes(r.id),
      likeCount: tweetLikedMap[r.id] ? tweetLikedMap[r.id] : 0,
      replyCount: tweetRepliedMap[r.id] ? tweetRepliedMap[r.id] : 0
    }))

    const sortedData = data.sort((a, b) => b.createdAt - a.createdAt)

    res.render('tweets', { tweets: sortedData, user: req.user, users: usersSorted })
  },
  postTweet: (req, res, next) => {
    const description = req.body.description
    const UserId = req.user.id
    if (!description.trim) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文字數限制在 140 以內!')
      return res.redirect('back')
    }
    Tweet.create({
      UserId,
      description
    })
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this Tweet!')

        return Like.create({
          UserId: req.user.id,
          TweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (!like) throw new Error("You haven't liked this Tweet")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTweet: async (req, res, next) => {
    const TweetId = req.params.id
    const [tweet, replies, likes, users] = await Promise.all([
      Tweet.findByPk(TweetId, {
        include: [User],
        nest: true
      }),
      Reply.findAll({
        where: { TweetId },
        include: [User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({
        where: { TweetId },
        raw: true,
        nest: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
    ])

    const usersSorted = users.map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: req.user && req.user.Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

    if (!tweet) throw new Error("Tweet didn't exist!")
    const isLiked = likes.some(l => l.UserId === req.user.id)

    res.render('tweet.hbs', { tweet: tweet.toJSON(), replies, isLiked, likeCount: likes.length, replyCount: replies.length, users: usersSorted })
  }
}

module.exports = tweetController