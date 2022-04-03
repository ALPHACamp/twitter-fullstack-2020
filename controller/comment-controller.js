const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const commentController = {
  postComment: (req, res, next) => {
    const { tweetId, comment } = req.body
    const userId = helpers.getUser(req).id

    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (!tweet) throw new Error("Tweet doesn't exist!")
        return Reply.create({
          comment,
          tweetId,
          userId
        })
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
