const { UCS2_PERSIAN_CI } = require('mysql2/lib/constants/charsets')
const { User, Tweet, Followship, Like } = require('../models')

const adminController = {
  signInPage: (req, res) => { // 後台登入
    res.render('admin/signin')
  },
  getTweets: (req, res) => { // 後台取得推文清單
    return Tweet.findAll({
      include: User,
      nest: true,
      raw: true
    }).then((tweets) => {
      const data = tweets.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      console.log(data)
      return res.render('admin/tweets', { tweets: data })
    })
      .catch(err => console.log(err))
  }
,
  getUsers: (req, res) => { // 後台取得使用者列表
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
          tweetCount: user.Tweets.length
        }))
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