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

  getAdminUsers: async (req, res) => {
    try {
      const users = await User.findAndCountAll({
        raw: true,
        nest: true,
      })

      let Data = []
      Data = users.rows.map(async (user, index) => {
        const [like, following, follower, reply] = await Promise.all([
          Like.findAndCountAll({
            raw: true,
            nest: true,
            where: { userId: user.id },
          }),
          Followship.findAndCountAll({
            raw: true,
            nest: true,
            where: { followerId: user.id },
          }),
          Followship.findAndCountAll({
            raw: true,
            nest: true,
            where: { followingId: user.id },
          }),
          Reply.findAndCountAll({
            raw: true,
            nest: true,
            where: { UserId: user.id },
          })
        ])
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          account: user.account,
          cover: user.cover,
          like: like,
          following: following,
          follower: follower,
          reply: reply
        }
      })
      Promise.all(Data).then(data => {
        console.log(data)
        return res.render('admin/users', { data })
      })

    }

    catch (err) {
      req.flash('error_message', err)
      return res.redirect('/') // 假定回到首頁
    }
  }

}
module.exports = adminController