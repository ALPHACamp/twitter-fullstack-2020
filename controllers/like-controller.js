const { Tweet, Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  getUserLike: (req, res, next) => {
    const userId = Number(req.params.id)

    return Tweet.findAll({ where: { userId }, raw: true, nest: true })
      .then(tweets => {
        if (!tweets.length) throw new Error("There isn't tweet that user liked.")

        res.json({ status: 'success', ...tweets })
      })
      .catch(err => next(err))
  },
  postLike: (req, res, next) => {
    const tweetId = Number(req.params.id)
    const userId = Number(helpers.getUser(req).id)

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("This tweet isn't Existed.")

        return Like.create({
          UserId: userId,
          TweetId: tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  postUnlike: (req, res, next) => {
    const userId = Number(helpers.getUser(req).id)
    const tweetId = Number(req.params.id)

    return Like.findOne({ where: { UserId: userId, TweetId: tweetId } })
      .then(like => {
        if (!like) throw new Error("You don't have liked this tweet.")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = likeController
