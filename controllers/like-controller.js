const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const helpers = require('../_helpers')
const likeController = {
  likeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          throw new Error('This tweet id do not exist')
        }
        return Like.findOrCreate({
          where:{
            UserId,
            TweetId
          }
        })
      })
      .then(() => res.redirect(`${req.get('Referrer')}#tweetId${TweetId}`))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    return Like.findOne({
      where:{
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) {
          throw new Error('This tweet id do not exist')
        }
        return like.destroy()
      })
      .then(() => res.redirect(`${req.get('Referrer')}#tweetId${TweetId}`))
      .catch(err => next(err))
  },
}
module.exports = likeController