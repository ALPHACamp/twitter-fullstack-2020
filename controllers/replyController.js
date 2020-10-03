const { User, Reply, Tweet, Like } = require('../models')
const helpers = require("../_helpers")

let replyController = {
  getReplylist: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        {model: Reply, include: [User]},
        { model: User, as: 'LikedUsers' }
      ]
    }).then(reply => {
      const isLiked = reply.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        return res.render('replylist', {
          reply: reply.toJSON(),
          isLiked: isLiked
        })
    })
  },
  postReply: (req, res) => {
    const replyDesc = req.body.text
    if (replyDesc.length === 0) {
       req.flash('error_messages', '不可空白')
      return res.redirect(`/replylist/${req.body.tweetId}`)
    }
    return Reply.create({
      comment: replyDesc,
      TweetId: req.body.tweetId,
      UserId: helpers.getUser(req).id
    })
    .then((reply) => {
      res.redirect(`/replylist/${req.body.tweetId}`)
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
     .then(like => {
       return res.redirect('back')
     })
   },
   removeLike: (req, res) => {
    return Like.findOne({where: {
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }})
      .then(like => {
        like.destroy()
         .then((like) => {
           return res.redirect('back')
         })
      })
   }
}
module.exports = replyController