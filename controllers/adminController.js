const { off } = require('../app')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const pageLimit = 10

const adminController = {
  getAdminTweets: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    return Tweet.findAndCountAll({
      raw: true,
      nest: true,
      include: [User],
      offset,
      limit: pageLimit,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(tweets.count / pageLimit)
      const totalPage = Array.from({ length: pages }, (item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      return res.render('admin/tweets', {
        tweets: tweets.rows,
        page,
        totalPage,
        prev,
        next
      })
    })
  },

  deleteAdminTweet: (req, res) => {
    return Tweet.findOne({
      where: {
        id: req.params.tweetId
      }
    }).then(tweet => {
      tweet.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
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
  },

  adminSignInPage: (req, res) => {
    return res.render('admin/adminsignin')
  },

  adminSignIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

}
module.exports = adminController