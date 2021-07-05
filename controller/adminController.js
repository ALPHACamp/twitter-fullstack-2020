const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const adminController = {
  getAdminTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      return res.render('admin/tweets', { tweets })
    })
  },

  getAdminUsers: (req, res) => {
    return User.findAndCountAll({
      raw: true,
      nest: true,
    }).then(users => {
      let Data = []

      // users.rows.forEach((user, i) => {
      //   let data = {
      //     likeCount: 0,
      //     followingCount: 0,
      //     followerCount: 0,
      //     replyCount: 0
      //   }
      //   Like.findAndCountAll({
      //     raw: true,
      //     nest: true,
      //     where: { userId: user.id },
      //   }).then(likes => {
      //     data.likeCount = likes.count
      //   })

      //   Followship.findAndCountAll({
      //     raw: true,
      //     nest: true,
      //     where: { followerId: user.id },
      //   }).then(followships => {
      //     data.followingCount = followships.count
      //   })

      //   Followship.findAndCountAll({
      //     raw: true,
      //     nest: true,
      //     where: { followingId: user.id },
      //   }).then(followships => {
      //     data.followerCount = followships.count
      //   })

      //   Reply.findAndCountAll({
      //     raw: true,
      //     nest: true,
      //     where: { UserId: user.id },
      //   }).then(replies => {
      //     data.replyCount = replies.count
      //     Data.push(data)
      //   })

      // })
      return res.render('admin/users', { users: users.rows })

    })
  }
}
module.exports = adminController