const { Tweet, User, Like } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    const [tweets, likes] = await Promise.all([
      Tweet.findAll({
        include: [User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({
        raw: true,
        nest: true
      })])

    const likedTweetsId = []
    likes.forEach(like => {
      if (like.UserId === req.user.id) {
        likedTweetsId.push(like.TweetId)
      }
    })
    console.log(likedTweetsId)

    const tweetLikedMap = {}
    likes.forEach(like => {
      if (!tweetLikedMap[like.TweetId]) {
        tweetLikedMap[like.TweetId] = 1
      } else {
        tweetLikedMap[like.TweetId] = tweetLikedMap[like.TweetId] + 1
      }
    })

    const data = tweets.map(r => ({
      ...r,
      isLiked: likedTweetsId.includes(r.id),
      likeCount: tweetLikedMap[r.id] ? tweetLikedMap[r.id] : 0
    }))
    res.render('tweets', { tweets: data })
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
      return res.redirect('/tweets')
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
  }
}
module.exports = tweetController
