const { Tweet, User, Reply, Like } = require('../models')
const helper = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const tweetRoute = true
    const currentUser = helper.getUser(req)
    return Tweet.findAll({
      include: [
        User,
        { model: Like, as: 'LikedUsers' },
        { model: Reply }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        if (!tweets.length) throw new Error('No tweets found!')
        tweets = tweets.map(tweet => {
          const { dataValues, User, Replies, LikedUsers } = tweet
          return {
            ...dataValues,
            user: User.dataValues,
            repliesCount: Replies.length,
            likesCount: LikedUsers.filter(likedUser => likedUser.isLike).length,
            isLiked: LikedUsers.some(likedUser => likedUser.UserId === currentUser.id && likedUser.isLike)
          }
        })
        res.render('tweets', { tweets, tweetRoute, topUsers: req.topFollowingsList })
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
  },
  getTweet: (req, res, next) => {
    const currentUser = helper.getUser(req)
    const personalTweetRoute = true
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, {
      include: [
        User,
        { model: Like, as: 'LikedUsers' },
        { model: Reply }
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('No tweet found!')
        const { dataValues, Replies, User, LikedUsers } = tweet
        tweet = {
          ...dataValues,
          user: User.dataValues,
          Replies,
          repliesCount: Replies.length,
          likesCount: LikedUsers.filter(likedUser => likedUser.isLike).length,
          isLiked: LikedUsers.some(likedUser => likedUser.UserId === currentUser.id && likedUser.isLike)
        }
        console.log(Replies)
        res.render('tweet', { tweet, personalTweetRoute, currentUser, topUsers: req.topFollowingsList })
      })
  }
}
module.exports = tweetController
