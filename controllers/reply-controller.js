const { Reply } = require('../models')

const replyController = {
  getReplies:(req,res,next)=>{ // 回覆頁面
    res.render('reply')
  },
  createReply:(req,res,next)=>{// 新增回覆
    const UserId = 2 //helpers.getUser(req).id
    const { description } = req.body
    const TweetId = req.params.id
    if (!description) {
      req.flash('error_messages', '貼文不可空白')
      return res.redirect('back')
    }
    if (description.trim() === '') {
      req.flash('error_messages', '貼文不可空白')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '貼文不得超過140個字')
      return res.redirect('back')
    }
    return Reply.create({
      UserId,
      TweetId,
      comment : description
    })
      .then(() => res.redirect(`/tweets/${TweetId}`))
      .catch(err => console.log(err))
  }
}
module.exports = replyController
