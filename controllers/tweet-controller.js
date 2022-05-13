const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const loginUser = getUser(req) ? getUser(req).id : 2
    return Promise.all([
      User.findByPk(loginUser, { raw: true, nest: true }),
      Tweet.findAll({
        include: User,
        raw: true,
        nest: true
      })
    ])
      .then(([user, tweets]) => {
        if (!user) {
          req.flash('error_messages:', "User is didn't exist!")
          res.redirect('/login')
        }
        console.log('tweets:', tweets)
        return res.render('tweets', { user, tweets })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
