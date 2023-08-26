const { Tweet, User, Like } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        include: [User],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({
        where: { UserId: req.user.id },
        raw: true,
        nest: true
      })])
      .then(([tweets, likes]) => {
        const likedTweetsId = req.user && likes.map(lr => lr.TweetId)
        const data = tweets.map(r => ({
          ...r,
          isLiked: likedTweetsId.includes(r.id),
          countLiked: Like.findAll({
            where: { TweetId: r.id }
          }).then(likes => {
            const usersLiked = likes.map(lr => lr.UserId)
            return usersLiked.length
          })
        }))
        res.render('tweets', { tweets: data })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const description = req.body.description
    const UserId = req.user.id
    if (!description.trim) {
      req.flash('error_messages', '內容不可空白')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文字數限制在 140 以內!')
      return res.redirect('/tweets')
    }
    Tweet.create({
      UserId,
      description
    })
      .then(() => {
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
