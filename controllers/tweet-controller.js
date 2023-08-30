const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const reqUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: User },
          { model: Reply },
          { model: Like }
        ]
      }),
      Like.findAll({
        where: {
          userId
        },
        raw: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      User.findByPk(userId)
    ])
      .then(([tweets, like, users, user]) => {
        const likedTweets = like.map(like => like.tweetId)
        const data = tweets.map(t => ({
          ...t.toJSON(),
          isLiked: likedTweets.includes(t.id),
          avatar: reqUser.avatar
        }))
        // topUser
        const topUsers = users
          .map(u => ({
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
        // console.log(req.user)
        res.render('tweet', { tweets: data, reqUser, topUsers, user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('不可超過140字')
    User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({ description, UserId })
      })
      .then(() => {
        req.flash('success_messages', '推文新增成功!')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { tweetId } = req.params
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: helpers.getUser(req).id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        // console.log(like)
        if (!tweet) throw new Error("tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          userId: helpers.getUser(req).id,
          tweetId: req.params.tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: helpers.getUser(req).id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")
        // console.log(like)
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = tweetController
