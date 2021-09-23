const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    Tweet.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    }).then(tweets => {
      const tweetData = tweets.rows.map(row => ({
        ...row.dataValues,
        tweetUserAvatar: row.User.dataValues.avatar,
        tweetUserName: row.User.dataValues.name,
        tweetUserAccount: row.User.dataValues.account,
        tweetContent: row.content,
        tweetRepliesCount: row.Replies.length,
        tweetLikesCount: row.Likes.length,
      }))
      return res.render('twitter', {
        tweets: tweetData,
      })
    })
  },
  getTwitter: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        Reply,
        Like,
        User
      ]
    }).then(tweet => {
      const tweetUser = tweet.dataValues.User.dataValues
      const tweetRepliesCount = tweet.dataValues.Replies.length
      const tweetLikesCount = tweet.dataValues.Likes.length
      const whereQuery = {}
      whereQuery.tweetId = Number(req.params.id)
      Reply.findAndCountAll({
        include: [
          User
        ],
        where: whereQuery,
      }).then(reply => {
        const replyUser = reply.rows
        return res.render('replyList', {
          tweet: tweet,
          tweetUser: tweetUser,
          tweetRepliesCount: tweetRepliesCount,
          tweetLikesCount: tweetLikesCount,
          replyUser: replyUser,
        })
      })
    })
  },
}

// getRestaurant: (req, res) => {
//   return Restaurant.findByPk(req.params.id, {
//     include: [
//       Category,
//       { model: User, as: 'FavoritedUsers' },
//       { model: User, as: 'LikedUsers' },
//       { model: Comment, include: [User] }
//     ]
//   }).then(async restaurant => {
//     const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
//     const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
//     restaurant.viewCount = await restaurant.increment('viewCount')
//     restaurant.save()
//     return res.render('restaurant', {
//       restaurant: restaurant.toJSON(),
//       isFavorited: isFavorited,
//       isLiked: isLiked
//     })
//   })
// },

module.exports = twitterController