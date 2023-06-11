const { User, Tweet } = require('../models')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },

  signIn: (req, res) => {
    res.redirect(302, '/admin/tweets')
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      // raw: true,
      // nest: true,
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(tweet => ({
          ...tweet.toJSON(),
          description: tweet.description.substring(0, 50)
        }))
        console.log(data)
        return res.render('admin/admin-tweets', { tweets: data })
      })
      .catch(err => next(err))
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
      .then(() => res.redirect(302, '/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
