const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },

  signIn: (req, res) => {
    res.redirect('/admin/tweets')
  },

  // 未完成
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },

  // 未完成
  getUsers: (req, res, next) => {
    // render 頁面的參數：
    // tweetCount 每個 user 的推文總數
    // likeCount 每個 user 被按讚總數
    // followingCount 每個 user 追蹤者總數
    // followerCount 每個 user 追隨者總數

    return User.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      where: { is_admin: false }
    })
      .then(users => {
        // console.log(users)
        res.render('admin/admin-users', { users })
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
