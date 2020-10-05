const db = require('../models')
const ReplyComment = db.ReplyComment
const helpers = require('../_helpers');

const replyController = {
  postReply: (req, res) => {
    const { comment } = req.body
    if (!comment) {
      req.flash('error_messages', '留言不得為空白')
      return res.redirect('back')
    }
    else {
      ReplyComment.create({
        UserId: helpers.getUser(req).id,
        ReplyId: req.params.replyId,
        comment
      })
        .then(replyComment => {
          return res.redirect('back')
        })
    }
  },

  deleteReply: (req, res) => {
    ReplyComment.findByPk(req.params.replyId)
      .then(replyComment => {
        replyComment.destroy()
          .then(replyComment => {
            return res.redirect('back')
          })
      })
  },

  editReply: (req, res) => {
    ReplyComment.findByPk(req.params.replyId)
      .then(replyComment => {
        const { comment } = req.body
        if (!comment) {
          req.flash('error_messages', '留言不得為空白')
          return res.redirect('back')
        }
        if (comment.length > 100) {
          req.flash('error_messages', '留言字數不得超過100字')
          return res.redirect('back')
        }
        else {
          replyComment.update({
            comment
          })
            .then(replyComment => {
              req.flash('success_messages', '已成功更新留言')
              return res.redirect('back')
            })
        }
      })
  }
}

module.exports = replyController