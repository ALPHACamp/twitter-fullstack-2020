const { User, Tweet, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (req.user.role === 'user') {
      req.flash('error_messages', '此帳號不存在！')
      req.logout()
      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/admin/tweets')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getTweets: (req, res, next) => {
    const DEFAULT_LIMIT = 7
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Tweet.findAndCountAll({
      include: [User],
      limit,
      offset,
      nest: true,
      raw: true
    })
      .then(tweets => {
        const result = tweets.rows
          .map(tweet => ({
            ...tweet,
            description: tweet.description.substring(0, 50)
          }))
        res.render('admin/tweets', { result, pagination: getPagination(limit, page, tweets.count) })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!'")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        { model: Tweet, foreignKey: 'userId' },
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        if (!users) throw new Error("User didn't exist!")
        const initialValue = 0
        const result = users
          .map(user => ({
            ...user.toJSON(),
            tweetsCount: user.Tweets.length,
            likesCount: user.Tweets.map(tweet => tweet.Likes.length).reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              initialValue
            )
          }))
          .sort((a, b) => b.tweetsCount - a.tweetsCount)
        res.render('admin/users', { result })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
