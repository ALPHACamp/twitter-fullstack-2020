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

      const [tweets, follows, likes] = await Promise.all([
        Tweet.findAll({ raw: true }),
        Followship.findAll({ raw: true }),
        Like.findAll({ raw: true })
      ])

      const tweetsMap = {} // 推文數量計數 { 'userId' : count }
      tweets.forEach(tweet => {
        if (!tweetsMap[tweet.UserId]) {
          tweetsMap[tweet.UserId] = 1
        } else {
          tweetsMap[tweet.UserId] = tweetsMap[tweet.UserId] + 1
        }
      })

      const followingsMap = {} // 跟隨中數量計數 { 'userId' : count }
      const followersMap = {} // 跟隨者數量計數 { 'userId' : count }
      follows.forEach(follow => {
        if (!followingsMap[follow.followerId]) {
          followingsMap[follow.followerId] = 1
        } else {
          followingsMap[follow.followerId] = followingsMap[follow.followerId] + 1
        }
        if (!followersMap[follow.followingId]) {
          followersMap[follow.followingId] = 1
        } else {
          followersMap[follow.followingId] = followersMap[follow.followingId] + 1
        }
      })

      const tweetLikedMap = {} // 推文被喜歡數量計數 { 'tweetId' : count }
      likes.forEach(like => {
        if (!tweetLikedMap[like.TweetId]) {
          tweetLikedMap[like.TweetId] = 1
        } else {
          tweetLikedMap[like.TweetId] = tweetLikedMap[like.TweetId] + 1
        }
      })

      const userLikedMap = {} // 使用者全部推文被喜歡數量計數 { 'userId' : count }
      tweets.forEach(tweet => {
        if (tweetLikedMap[tweet.id]) {
          if (!userLikedMap[tweet.UserId]) {
            userLikedMap[tweet.UserId] = 0
          }
          userLikedMap[tweet.UserId] = userLikedMap[tweet.UserId] + tweetLikedMap[tweet.id]
        }
      })

      const userData = await users.map((user, index) => ({
        ...user.toJSON(),
        tweetsCount: tweetsMap[user.id] ? tweetsMap[user.id] : 0,
        followingsCount: followingsMap[user.id] ? followingsMap[user.id] : 0,
        followersCount: followersMap[user.id] ? followersMap[user.id] : 0,
        likeCount: userLikedMap[user.id] ? userLikedMap[user.id] : 0
      }))

      // 依照推文數量排序
      userData.sort((a, b) => {
        return b.tweetsCount - a.tweetsCount
      })

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
    const tweetId = req.params.id
    Tweet.destroy({ where: { id: tweetId } })
      .then(tweet => {
        res.redirect('/admin/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
