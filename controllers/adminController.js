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
        // { model: Like, include: Tweet }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(users => {
        const followersCount = users.Followers.length
        const followingsCount = users.Followings.length
        const repliesCount = users.Replies.length

        res.render('admin/users', { users, followersCount, followingsCount, repliesCount })
      })
  }
}

module.exports = adminController