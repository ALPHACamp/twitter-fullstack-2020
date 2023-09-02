const { Tweet, User } = require('../../models')

const tweetController = {
  getTweet: (req, res, next) => {
    console.log('要抓API了')
    return Tweet.findByPk(req.params.id, {
      raw: true
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        console.log(`fetch到http://localhost:3000/api/tweets/${req.params.id}`)
        User.findByPk(tweet.UserId, {
          raw: true
        })
          .then(user => {
            return res.json({
              name: user.name,
              account: user.account,
              avatar: user.avatar,
              tweet_id: tweet.id,
              createdAt: tweet.createdAt,
              description: tweet.description,
              loginUserAvatar: req.user.avatar
            })
          })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
