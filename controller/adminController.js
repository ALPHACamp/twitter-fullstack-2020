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
        const [following, follower, userTweet] = await Promise.all([
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
        const likes = await Like.findAndCountAll({
          raw: true,
          nest: true,
          where: { TweetId: userTweet.rows.id },
        })
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          account: user.account,
          cover: user.cover,
          likes: likes,
          following: following,
          follower: follower,
          userTweet: userTweet
        }
      })
      Promise.all(Data).then(data => {
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