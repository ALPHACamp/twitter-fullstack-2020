const { User, Tweet, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const loginUser = getUser(req) ? getUser(req).id : Number(2)
    return Promise.all([
      User.findByPk(loginUser, { raw: true, nest: true }),
      Tweet.findAll({
        include: User,
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
  }
}

module.exports = tweetController
