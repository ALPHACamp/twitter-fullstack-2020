const { Tweet } = require('../../models')

const tweetController = {
  getTweets: (req, res) => {
    res.render('tweets')
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
