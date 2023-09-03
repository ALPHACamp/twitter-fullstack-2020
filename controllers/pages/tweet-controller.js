const { Tweet, User, Like, Reply } = require('../../models')
const helpers = require('../../_helpers')

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
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

    const likedTweetsId = []
    likes.forEach(like => {
      if (like.UserId === helpers.getUser(req).id) {
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

    res.render('tweets', {
      tweets: sortedData,
      user: helpers.getUser(req),
      users: usersSorted,
      Tweets: true
    })
  },
  postTweet: (req, res, next) => {
    const description = req.body.description
    const UserId = helpers.getUser(req).id
    if (!description.trim) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '內容不可超出 140 字')
      return res.redirect('back')
    }
    Tweet.create({
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
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (like) throw new Error('您已經對此推文按過愛心')

        return Like.create({
          UserId: helpers.getUser(req).id,
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
          UserId: helpers.getUser(req).id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!like) throw new Error('您尚未對此推文按愛心')

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getReplies: async (req, res, next) => {
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
      isFollowed: helpers.getUser(req) && helpers.getUser(req).Followings.some(f => f.id === user.id)
    })).sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

    if (!tweet) throw new Error("Tweet didn't exist!")
    const isLiked = likes.some(l => l.UserId === helpers.getUser(req).id)

    res.render('tweet.hbs', { tweet: tweet.toJSON(), replies, isLiked, likeCount: likes.length, replyCount: replies.length, users: usersSorted })
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    if (!comment.trim) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (comment.length > 140) {
      req.flash('error_messages', '內容不可超出 140 字')
      return res.redirect('back')
    }

    Reply.create({
      UserId,
      TweetId,
      comment
    })
      .then(() => {
        req.flash('tweet_success', '回覆發送成功')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
