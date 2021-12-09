const helpers = require('../_helpers')

const db = require('../models')
const { User, Reply } = db

const replyController = {
  getReplies: async (req, res) => {
    try {
      const TweetId = Number(req.params.tweetId)
      const replies = await Reply.findAll({
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'name', 'avatar', 'account'],
          require: false
        }
      })
      return res.json({ replies })
    } catch (err) {
      console.error(err)
    }
  },

  addReply: async (req, res) => {
    try {
      if (req.body.comment === '') {
        req.flash('error_messages', '內容不可空白')
        return res.redirect('back')
      }

      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId,
        comment: req.body.comment
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = replyController
