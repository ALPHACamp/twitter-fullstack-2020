const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res) => { // 瀏覽已回覆的內容
    const isUser = helpers.getUser(req).id === Number(req.params.id)
    return User.findByPk((req.params.id), {
      where: { role: 'user' },
      include: [
        Tweet,
        { model: Reply, include: { model: Tweet, include: [User] } }
      ],
      order: [
        [Reply, 'updatedAt', 'DESC']
      ]
    })
      .then(user => {
        const repiles = user.toJSON().Replies.map(res => res)
        res.render('reply', {
          users: user.toJSON(),
          repiles,
          isUser
        })
      })
  },
  createReply: (req, res, next) => { // 新增回覆
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    const TweetId = req.params.id

    //     if (!description) {
    //       req.flash('error_reply', '內容不可空白')
    //       return res.redirect('back')
    //     }
    //     if (description.trim() === '') {
    //       req.flash('error_reply', '內容不可空白')
    //       return res.redirect('back')
    //     }
    //     if (description.length > 140) {
    //       req.flash('error_reply', '字數已超過上限140個字')
    //       return res.redirect('back')
    //     }

    return Reply.create({
      UserId,
      TweetId,
      comment: description
    })
      .then(() => res.redirect(`/tweets/${TweetId}/replies`))
      .catch(err => next(err))
  }
}
module.exports = replyController
