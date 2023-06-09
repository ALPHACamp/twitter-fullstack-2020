const { User, Tweet } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => { // 瀏覽總推文清單
    return Tweet.findAll({
      include: [
        User,
        { model: User, as: 'LikedUsers' }
      ],
      nest: true,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description
        }))
        return User.findByPk(helpers.getUser(req).id)
          .then(user => {
            user = user.toJSON()
            return res.render('tweets', { tweets: data, user })
          })
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => { // 瀏覽個人推文
    const id = req.params.id
    return Tweet.findByPk(id, {
      include: [
        User,
        { model: User }
      ]
    })
      .then(tweet => {
        tweet = tweet.toJSON()
        res.render('tweet', {
          tweet
        })
      })
      .catch(err => next(err))
  },
  createTweet: (req, res, next) => { // 新增推文
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (description.trim() === '') {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '字數已超過上限140個字ˇ')
      return res.redirect('back')
    }
    return Tweet.create({
      UserId,
      description
    })
      .then(() => res.redirect('/tweets'))
      .catch(err => next(err))
  }
}

module.exports = tweetController
