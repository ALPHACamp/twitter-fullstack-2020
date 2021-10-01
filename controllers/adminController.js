const db = require('../models')
const { User, Tweet } = db
const helpers = require('../_helpers')

const adminController = {
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },

  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res) => {
    Tweet.findAndCountAll({
      include: [User],
    })
      .then((result) => {
        const data = result.rows.map((tweet) => ({
          ...tweet.dataValues,
          description:
            tweet.dataValues.description.length >= 50
              ? tweet.dataValues.description.substring(0, 50) + '...'
              : tweet.dataValues.description,
        }))
        res.render('admin/tweets', {
          tweets: data,
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  deleteTweet: (req, res) => {
    const id = req.params.id
    return Tweet.findByPk(id)
      .then((tweet) => {
        tweet.destroy()
      })
      .then(() => {
        req.flash('success_messages', '推文刪除成功！')
        return res.redirect('back')
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  getUsers: (req, res) => {
    User.findAndCountAll({
      include: [
        Tweet,
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
      .then((usersResult) => {
        const data = usersResult.rows.map((user) => ({
          ...user.dataValues,
          userTweetAmount: user.Tweets.length,
          likedTweetAmount: user.LikedTweets.length,
          followingAmount: user.Followings.length,
          followerAmount: user.Followers.length,
        }))

        data.sort((a, b) => b.userTweetAmount - a.userTweetAmount)
        res.render('admin/users', { users: data })
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
}

module.exports = adminController
