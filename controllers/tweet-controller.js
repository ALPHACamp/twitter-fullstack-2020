const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => { // 瀏覽總推文清單
    return Tweet.findAll({
      include: [
        User,
        { model: Reply, include: User },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description,
          isLiked: helpers.getUser(req)?.LikedTweets?.map(t => t.id).includes(t.id) // 判斷目前登入使用者是否喜歡這篇Tweet
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
        { model: Reply, include: User },
        { model: User, as: 'LikedUsers' }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    })
      .then(tweet => {
        tweet = tweet.toJSON()
        tweet.isLiked = helpers.getUser(req)?.LikedTweets?.some(l => l.id === tweet.id)
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
      req.flash('error_messages', '字數已超過上限140個字')
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
