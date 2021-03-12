const db = require('../models')
const { User, Tweet } = db
const helpers = require('../_helpers')

const adminController = {
  AdminSignInPage: (_req, res) => {
    return res.render('adminSignin')
  },
  AdminSignIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('success_messages', 'Sign in successfully！')
      res.redirect('/admin/tweets')
    } else {
      req.flash('error_messages', '使用者請從前台登入！')
      res.redirect('/admin/signin')
    }
  },
  getTweets: (req, res) => {
    let offset = 0
    const pageLimit = 7
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Tweet.findAndCountAll({
      include: [User],
      offset,
      limit: pageLimit
    })
      .then(result => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = result.rows.map(tweet => ({
          ...tweet.dataValues,
          description: tweet.dataValues.description.substring(0, 50)
        }))
        res.render('admin/tweets', { tweets: data, page, totalPage, prev, next })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  deleteTweet: (req, res) => {
    const id = req.params.tweetId
    return Tweet.findByPk(id)
      .then(tweet => {
        tweet.destroy()
      })
      .then(() => {
        req.flash('success_messages', '推文刪除成功！')
        return res.redirect('back')
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  getUsers: (req, res) => {
    let offset = 0
    const pageLimit = 12
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    User.findAndCountAll({
      offset,
      limit: pageLimit,
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(usersResult => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(usersResult.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = usersResult.rows.map(user => ({
          ...user.dataValues,
          userTweetAmount: user.Tweets.length,
          likedTweetAmount: user.LikedTweets.length,
          followingAmount: user.Followings.length,
          followerAmount: user.Followers.length
        }))

        data.sort((a, b) => b.userTweetAmount - a.userTweetAmount)
        res.render('admin/users', { users: data, page, totalPage, prev, next })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = adminController
