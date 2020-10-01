const db = require('../models')
const User = db.User
const Tweet = db.Tweet


const adminControllers = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    })
      .then(tweets => {
        console.log(tweets)
        return res.render('admin/tweets', { tweets })
      })
  }
}

module.exports = adminControllers