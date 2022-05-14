const { Tweet, User } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Admin成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(tweets => {
        const tweetPreview = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.render('admin/tweets', {
          tweets: tweetPreview
        })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
