const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship

const maxDescLen = 50

const adminController = {
  // 載入登入頁
  signInPage: (req, res) => {
    return res.render('signin')
  },

  // 登入跳轉
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  // 列出所有tweets，需處理tweets內容，超出maxDescLen字數則擷取maxDescLen字數並於後方加上"..."
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC'], // Sorts by createdAt in descending order
      ],
    })

    tweets.map(tweet => {
      tweet.description = tweet.description.length <= maxDescLen ? tweet.description : tweet.description.substring(0, maxDescLen) + "..."
    })

    return res.render('admin/tweets', { tweets })
  },

  // 刪除單一tweet
  deleteTweet: async (req, res) => {
    const TweetID = req.params.id

    await Like.destroy({ where: { TweetID } })
    await Reply.destroy({ where: { TweetID } })
    await Tweet.destroy({ where: { id: TweetID } })

    res.redirect('/admin/tweets')
  },

  // 列出所有使用者
  getUsers: (req, res) => {
    User.findAll({
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ],
      where: { role: "user" }
    }).then(users => {
      const userData =
        users.map(user => ({
          ...user.dataValues,
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length,
          tweetCount: user.Tweets.length,
          likeCount: user.Tweets.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.likeCount
          }, 0)
        })).sort((a, b) => b.tweetCount - a.tweetCount)

      res.render('admin/users', { users: userData })
    })
  }
}

module.exports = adminController