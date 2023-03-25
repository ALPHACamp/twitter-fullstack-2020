const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => { // 進入推文清單
    const id = 1
    return Tweet.findAll({
      include: [
        User,
        Reply
      ],
      nest: true,
      order: [['createdAt', "desc"]],
      limit: 5
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description
        }))
        return User.findByPk(2)//helpers.getUser(req).id
          .then(user => {
            user = user.toJSON()
            return res.render('tweets', { tweets: data, user })
          })
      })
      .catch(err => console.log(err))
  },
  getTweet: (req, res, next) => { // 登入使用者頁面顯示個人推文清單
    const { id } = req.params
    return Tweet.findByPk(id, {
      include: [
        User,
        { model: Reply, include: User }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    })
      .then(tweet => {
        tweet = tweet.toJSON()
        res.render('tweet', { tweet })
      })
      .catch(err => console.log(err))
  },
  createTweet: (req, res, next) => {
    const UserId = 2 //helpers.getUser(req).id
    const {description} = req.body
    if (!description){
      req.flash('error_messages', '貼文不可空白')
      return res.redirect('back')
    }
    if (description.trim() === '') {
      req.flash('error_messages', '貼文不可空白')
      return res.redirect('back')
    }
    if (description.length > 140){
      req.flash('error_messages', '貼文不得超過140個字')
      return res.redirect('back')
    }
    return Tweet.create({
      UserId,
      description
    })
      .then(() => res.redirect('/tweets'))
      .catch(err => console.log(err))
  }
}

module.exports = tweetController