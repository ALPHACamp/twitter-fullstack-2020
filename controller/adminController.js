const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply
const helpers = require('../_helpers')
const adminController = {
  //登入頁面
  adminSignInPage: (req, res) => {
    if (res.locals.user) {
      delete res.locals.user
    }
    return res.render('admin/signin')
  },

  adminSignIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  getAdminTweets: (req, res) => {
    const user = helpers.getUser(req)
    const adminTweets = true
    return Tweet.findAndCountAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      return res.render('admin/tweets', {
        user,
        tweets: tweets.rows,
        adminTweets
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
      const adminUser = true

      let Data = []
      Data = users.rows.map(async (user, index) => {
        const [following, follower, tweet] = await Promise.all([
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
          Tweet.findAndCountAll({
            raw: true,
            nest: true,
            where: { UserId: user.id },
          })
        ])
        let tweetLike = tweet.rows.map(async (tw, index) => {
          const like = await Like.findAndCountAll({
            raw: true,
            nest: true,
            where: { tweetId: tw.id }
          })
          return like.count
        })
        tweetLike = await Promise.all(tweetLike)
        const like = tweetLike.length > 0 ? tweetLike.reduce((a, b) => a + b) : 0
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          account: user.account,
          cover: user.cover,
          following: following,
          follower: follower,
          userTweet: tweet,
          like: like
        }
      })
      Promise.all(Data).then(data => {
        data = data.sort((a, b) => b.userTweet.count - a.userTweet.count)
        return res.render('admin/users', { data, adminUser })
      })

    }

    catch (err) {
      req.flash('error_message', err)
      return res.redirect('/') // 假定回到首頁
    }
  },

}
module.exports = adminController