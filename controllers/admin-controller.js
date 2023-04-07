const { User, Tweet, Followship, Like } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  signInPage: (req, res) => { // 後台登入
    res.render('admin/signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => { // 後台取得推文清單
    return Tweet.findAll({
      include: User,
      nest: true,
      raw: true,
      order: [
        ['createdAt', 'DESC'],
        ]
    }).then((tweets) => {
      const data = tweets.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      return res.render('admin/tweets', { tweets: data })
    })
      .catch(err => console.log(err))
  }
,
  getUsers: (req, res, next) => { // 後台取得使用者列表
    return User.findAll({
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets'},
        Tweet
      ] 
    })
      .then((users) => {
        users = users.map(user => ({
          ...user.toJSON(),
          // 計算追蹤人數
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          likeCount: user.LikedTweets.length,
          tweetsCount: user.Tweets.length
        }))
        users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
        return res.render('admin/users', { users })
      })
      .catch(err => console.log(err))
  },
  deleteTweet: (req, res) => { // 後台刪除tweet
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => console.log(err))
  },
  logout: (req, res) => { // 後台登出
    res.redirect('signin')
  }
}

module.exports = adminController