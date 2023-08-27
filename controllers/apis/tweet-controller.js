const { Tweet, User } = require('../../models')

const tweetController = {
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      include: [User],
      raw: true
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")

        // const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)

        return res.json({
          tweet
        })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
