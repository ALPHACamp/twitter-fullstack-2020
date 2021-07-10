const { Tweet, User, Reply, Like } = require('../models')

const userService = {
  getUserTweets: async (req, res, callback) => {
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
    if(req.user.id !== req.params.id){
      thisPageUser.isFollowing = thisPageUser.Followers.map(Follower => Follower.id).includes(req.user.id)
    }
    console.log(thisPageUser)
    let tweets = await Tweet.findAll({
      where: { UserId: thisPageUser.id },
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    })
    tweets = tweets.map(tweet => ({
      ...tweet.dataValues,
      User: tweet.User.dataValues,
      RepliesCount: tweet.Replies.length,
      LikedUsersCount: tweet.LikedUsers.length,
      isLiked: tweet.LikedUsers.map(User=> User.id).includes(req.user.id)
    }))
    return callback({
      thisPageUser,
      tweets,
      Appear: { navbar: true, top10: true }
    })
  }
}

module.exports = userService