const { User, Tweet, Reply } = require('../models')

const replyController = {
  getReplies: async (req,res)=>{ // 已回覆的內容
            let [users, user] = await Promise.all([
            User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
            User.findByPk((2), {
                where: { role: 'user' },
                include: [
                    Tweet,
                    { model: Reply, include: { model: Tweet, include: [User] } },
                    { model: Tweet, as: 'LikedTweets', include: [User] },
                ],
                order: [
                    [Reply, 'updatedAt', 'DESC'],
                ],
            })
        ])
        
        const repiles = user.toJSON().Replies.map(res => res)
        return res.render('reply', {
            users: user.toJSON(),
            repiles,
        })
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
