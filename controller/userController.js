const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const userController = {
  // getUserTweets: (req, res) => {
  //   return User.findOne({
  //     where: {
  //       id: req.params.userId
  //     }
  //   }).then(user => {
  //     return res.render('user/tweets', { user: user.toJSON() })
  //   })
  // },

  getUserTweets: (req, res) => {
    const topFollowing = res.locals.data
    console.log(topFollowing)
    return User.findOne({
      where: {
        id: req.params.userId
      }
    }).then(user => {
      Followship.findAndCountAll({
        raw: true,
        nest: true,
        where: { followerId: user.id },
      }).then(following => {
        Followship.findAndCountAll({
          raw: true,
          nest: true,
          where: { followingId: user.id },
        }).then(follower => {
          Tweet.findAll({
            raw: true,
            nest: true,
            where: { userId: user.id },
          }).then(tweets => {
            return res.render('user/tweets', {
              user,
              followingCount: following.count,
              followerCount: follower.count,
              tweets,
              topFollowing
            })
          })
        })
      })
    })
  }

}
module.exports = userController