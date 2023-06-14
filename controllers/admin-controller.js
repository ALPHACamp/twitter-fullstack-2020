const helpers = require('../_helpers')
const { User, Followship, Tweet, Like } = require('../models')

const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/signin')
  },
  adminTweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminUsersPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminSignin: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  adminGetTweets: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    try {
      let [user, tweets] = await Promise.all([
        User.findByPk(userId, {
          raw: true,
          nest: true
        }),
        Tweet.findAll({
          include: User,
          order: [['createdAt', 'DESC']]
        })
      ])
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON()
      }))
      const partialName = 'admin-tweets'

      tweets.forEach(tweet => {
        if (tweet.description.length > 50) {
          const newText = tweet.description.slice(0, 50) + '...'
          delete tweet.description
          tweet.description = newText
        }
      })

      res.render('admin/tweets', {
        user,
        tweets: tweets,
        partialName
      })
    } catch (err) {
      next(err)
    }
  },
  adminGetUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        },
        order: [['createdAt', 'DESC']]
      })

      const count = await Promise.all(
        users.map(async user => ({
          tweetsCount: await Tweet.count({ where: { UserId: user.id } }),
          followingsCount: await Followship.count({
            where: { followerId: user.id }
          }),
          followersCount: await Followship.count({
            where: { followingId: user.id }
          }),
          likeCount: await Like.count({ where: { UserId: user.id } })
        }))
      )

      const userData = await users.map((user, index) => ({
        ...user.toJSON(),
        tweetsCount: count[index].tweetsCount,
        followingsCount: count[index].followingsCount,
        followersCount: count[index].followersCount,
        likeCount: count[index].likeCount
      }))

      const partialName = 'admin-users'
      const userPage = true
      res.render('admin/tweets', { userData, partialName, userPage })
    } catch (err) {
      next(err)
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('admin/signin')
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.body.tweetId
    Tweet.destroy(
      { where: { id: tweetId } }
    )
      .then(() => {
        res.redirect('/admin/tweets')
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController
