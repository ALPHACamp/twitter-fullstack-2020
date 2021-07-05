const db = require('../models')
const User = db.User

const userController = {
  getUserTweets: (req, res) => {
    return User.findOne({
      where: {
        id: req.params.userId
      }
    }).then(user => {
      return res.render('user/tweets', { user: user.toJSON() })
    })
  }
}
module.exports = userController