const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const twitterController = {
  getTwitters: (req, res) => {
    res.render('twitter')
  }


  //   return Promise.all([
  //     Tweet.findAll({
  //       limit: 10,
  //       raw: true,
  //       nest: true,
  //       order: [['createdAt', 'DESC']],
  //       include: [User, Reply, Like]
  //     }).then((tweets) => {
  //       return res.render('twitter', {
  //         tweets: tweets,
  //         User: users
  //       })
  //     })
  //   ])
  // },

}

module.exports = twitterController