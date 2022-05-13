const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const testUser = Number(3) // for local test

const tweetController = {
  getTweets: (req, res, next) => {
    const loginUser = getUser(req) ? getUser(req).id : testUser
    return Promise.all([
      User.findByPk(loginUser, { raw: true, nest: true }),
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User],
        raw: true,
        nest: true
      }),
      User.findAll({
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ])
      .then(([user, tweets, users]) => {
        if (!user) {
          req.flash('error_messages:', "User is didn't exist!")
          return res.redirect('/login')
        }
        const LIMIT = 10
        const userData = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: user.Followings.some(f => f.id === loginUser)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, LIMIT)
        return res.render('tweets', { user, tweets, users: userData })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = getUser(req) ? getUser(req) : testUser
    const { description } = req.body
    if (!userId) return req.flash('error_messages', '您尚未登入帳號!')
    if (!description) return req.flash('error_messages', '內容不可空白')
    Tweet.create({
      userId,
      description
    })
      .then(() => {
        req.flash('success_messages', '推文成功')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
