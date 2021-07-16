const { Tweet, User, Reply, Like } = require('../models')


const adminService = {
  getTweets: async (req, res, callback) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
      ]
    })
    tweets = tweets.map(t => ({
      ...t.dataValues,
      User: t.User.dataValues,
      description: t.dataValues.description.substring(0, 50),
    }))
    return callback({
      tweets,
      isAdmin: true,
      Appear: { navbar: true },
    })
  },

  getAllUsers: async (req, res, callback) => {
    let users = await User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    users = users.map(user => ({
      ...user.dataValues,
      TweetsCount: user.Tweets.length,
      LikedCount:user.Likes.length,
      FollowersCount: user.Followers.length,
      FollowingsCount: user.Followings.length,
    }))
    // let tweets = await Tweet.findAll({
    //   include: [
    //     User,
    //     Reply,
    //     { model: User, as: 'LikedUsers' }
    //   ],
    // })
    // tweets = tweets.map(tweet => ({
    //   ...tweet.dataValues,
    //   User: tweet.User.dataValues,
    //   RepliesCount: tweet.Replies.length,
    //   LikedUsersCount: tweet.LikedUsers.length,
    // }))
    users = users.sort((a, b) => b.TweetsCount - a.TweetsCount)
    return callback({
      users,
      // tweets,
      isAdmin: true,
      Appear: { navbar: true },
    })
  }
}

module.exports = adminService