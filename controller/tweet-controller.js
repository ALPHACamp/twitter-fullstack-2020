const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        nest: true,
        include: [
          User,
          Reply,
          Like
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([tweets, users]) => {
        const likedTweetId = helpers.getUser(req).Likes && helpers.getUser(req).Likes.map(l => l.tweetId)
        const data = tweets.map(t => ({
          ...t.toJSON(),
          isLiked: likedTweetId ? likedTweetId.includes(t.id) : null,
          replyCount: t.Replies ? t.Replies.length : null,
          likeCount: t.Likes ? t.Likes.length : null
        }))
        let userData = users.map(u => ({
          ...u.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.render('tweets', { tweets: data, users: userData, user: helpers.getUser(req) })
      })
  },
  postTweet: (req, res, next) => {
    const { content } = req.body
    if (!content) throw new Error('Please enter tweet content!')
    if (content.length > 140) throw new Error('Content exceeds length limitation!')

    return Tweet.create({
      userId: helpers.getUser(req).id,
      content
    })
      .then(() => {
        req.flash('success_messages', 'Tweet posted')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { tweetId } = req.params
    const userId = helpers.getUser(req).id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        if (like) throw new Error('You have already liked this tweet!')

        return Like.create({
          userId,
          tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        tweetId: req.params.tweetId,
        userId: helpers.getUser(req).id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Promise.all([
      Tweet.findByPk(req.params.tweetId, {
        nest: true,
        include: [
          User,
          Like,
          { model: Reply, include: User }
        ],
        order: [[{ model: Reply }, 'createdAt', 'DESC']]
      }),
      User.findAll({
        nest: true,
        where: {
          role: null
        },
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([tweet, users]) => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        const likedTweetId = helpers.getUser(req).Likes && helpers.getUser(req).Likes.map(l => l.tweetId)
        const data = {
          ...tweet.toJSON(),
          replyCount: tweet.Replies ? tweet.Replies.length : null,
          likeCount: tweet.Likes ? tweet.Likes.length : null,
          isLiked: likedTweetId ? likedTweetId.includes(tweet.id) : null
        }
        let userData = users.map(u => ({
          ...u.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === u.id),
          FollowerCount: u.Followers.length
        }))
        console.log(data)
        userData = userData.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        res.render('tweet', { tweet: data, users: userData, user: helpers.getUser(req) })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
