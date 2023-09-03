const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const tweetController = {
  getTweets: (req, res) => {
    const user = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like],
      nest: true
      }),
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: user.id }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([tweets, followShips]) => {
        tweets = tweets.map(tweet => ({
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          isLiked: tweet.Likes.some(like => like.UserId === user.id),
          ...tweet.toJSON()
        }))
        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)

        res.render('tweets', { user, tweets, currentUserId: user.id, topUser})
      })   
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (description.length > 140) throw new Error('超過字數上限')
    if (!description) throw new Error('內容不可空白')
    return Tweet.create({
      UserId,
      description
    })
      .then(() => res.redirect('/tweets'))
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    if (!comment) throw new Error('內容不可空白')
    if (comment.length > 140) throw new Error('超過字數上限')
    return Promise.all([
      Tweet.findByPk(TweetId),
      User.findByPk(UserId)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!user) throw new Error('使用者不存在')
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
    const user = helpers.getUser(req)
    return Promise.all([
      Tweet.findByPk(TweetId, {
        include: [
          User,
          { model: User, as: 'LikedUsers' }
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
      }),
      User.findAll({
        where:{
          role: 'user',
           id: { [Op.not]: user.id }
        },
        include: { model: User, as: 'Followers'}
      })
    ])
      .then(([tweet, replies, followShips]) => {
        if (!tweet) throw new Error('推文不存在')
        const replyCount = replies.count
        const likeCount = tweet.LikedUsers.length
        const isLiked = tweet.LikedUsers.some(u => u.id === req.user.id)

        // 推薦追隨
        const topUser = followShips.map(followShip => ({
          ...followShip.toJSON(),
          followerCount: followShip.Followers.length,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === followShip.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)

        res.render('tweet', {
          user,
          tweet: tweet.toJSON(),
          replies: replies.rows,
          replyCount,
          likeCount,
          isLiked,
          topUser,
          currentUserId: user.id
        })
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
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
    const UserId = helpers.getUser(req).id
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