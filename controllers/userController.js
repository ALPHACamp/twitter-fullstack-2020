const db = require("../models")
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [Reply] },
        { model: Tweet, include: [Like] },
        // { model: Tweet, as: "LikedTweets" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ],
    }).then((user) => {
      let results = user.toJSON()
      // let tweetsCont = user.
      return res.json(results)
    })
  },
  userSigninPage: (req, res) => {
    res.render('userSigninPage')
  },
  userSignupPage: (req, res) => {
    res.render('userSignupPage')
  }
}

module.exports = userController
