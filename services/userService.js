const { Tweet, User, Reply, Like } = require('../models')

const userService = {
  getUserTweets: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    const tweets = await getTweets(req, { UserId: thisPageUser.id })
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  },

  getUserReplies: async (req, res, callback) => {
    const thisPageUser = await getThisPageUser(req)
    let tweets = await getTweets(req, { '$Replies.UserId$': thisPageUser.id })
    console.log(tweets)
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  }


}

async function getThisPageUser(req) {
  let thisPageUser = await User.findByPk(req.params.id, {
    include: [
      Tweet,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  thisPageUser = {
    ...thisPageUser.dataValues,
    TweetsCount: thisPageUser.Tweets.length,
    FollowersCount: thisPageUser.Followers.length,
    FollowingsCount: thisPageUser.Followings.length,
  }
  if (req.user.id !== req.params.id) {
    thisPageUser.isFollowing = thisPageUser.Followers.map(Follower => Follower.id).includes(req.user.id)
  }
  return thisPageUser
}

async function getTweets(req, whereCondition) {
  let tweets = await Tweet.findAll({
    include: [
      User,
      Reply,
      { model: User, as: 'LikedUsers' }
    ],
    where: whereCondition
  })
  tweets = tweets.map(tweet => ({
    ...tweet.dataValues,
    User: tweet.User.dataValues,
    RepliesCount: tweet.Replies.length,
    LikedUsersCount: tweet.LikedUsers.length,
    isLiked: tweet.LikedUsers.map(User => User.id).includes(req.user.id)
  }))
  return tweets
}

module.exports = userService