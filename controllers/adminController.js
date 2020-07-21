const db = require('../models')
const User = db.User
const Reply = db.Reply
const Tweet = db.Tweet
const Like = db.Like

const adminController = {
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Reply, include: Tweet },
        { model: Like, include: Tweet }
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(result => {
        const users = result.map(item => ({
          ...item.dataValues,
          followingsCount: item.Followings.length,
          followersCount: item.Followers.length,
          likesCount: item.Likes.length,
          repliesCount: item.Replies.length
        }))

        res.render('admin/users', { users })
      })
  }
}

module.exports = adminController