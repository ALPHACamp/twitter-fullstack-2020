const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const { getUser } = require('../_helpers')
const likeController = {
  likeTweet: (req, res, next) => {
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          throw new Error('This tweet id do not exist')
        }
        return Like.findOrCreate({
          where:{
            UserId: getUser(req).id,
            TweetId
          }
        })
      })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    return Like.findOne({
      where:{
        UserId: getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) {
          throw new Error('This tweet id do not exist')
        }
        return like.destroy()
      })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  },
}
module.exports = likeController
