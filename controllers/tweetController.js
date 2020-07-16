const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getTweets: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(user => res.json(user))

    // const users = req.user.Followings.map(user => user.id)
    // Tweet
    //   .findAll({ where: { userId: users } })
    //   .then((tweets) => {
    //     res.json(tweets)
    //   })
    //   .catch(err => console.log(err))
  },
}

module.exports = tweetController