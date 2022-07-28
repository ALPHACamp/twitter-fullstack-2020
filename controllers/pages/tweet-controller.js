const { Tweet, User, Reply, Like } = require('../../models')

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetData = tweets.map(t => ({
          ...t.dataValues,
          name: t.User.name,
          account: t.User.account,
          avatar: t.User.avatar,
          replyCounts: t.Replies.length,
          likeCounts: t.Likes.length
        }))
        res.render('tweets', { tweetData })
      })
  },
  addTweet: (req, res) => {
    const UserId = req.user.id
    const { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不可超過140字')
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功發布推文')
        res.redirect('/tweets')
      })
  }
}

module.exports = tweetController
