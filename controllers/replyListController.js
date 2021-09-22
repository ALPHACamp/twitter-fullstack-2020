const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const replyListController = {
  getReplies: (req, res) => {
    return res.render('replyList', {})
  }
}


module.exports = replyListController