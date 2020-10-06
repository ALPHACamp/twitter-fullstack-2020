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
    //const comment = req.body.text
    const { comment } = req.body
    if (!comment) {
       req.flash('error_messages', '不可空白')
      return res.redirect(`/tweets/${req.body.tweetId}/replies`)
    }
    return Reply.create({
      UserId: helpers.getUser(req).id,
      comment: req.body.comment, 
      TweetId: req.body.tweetId
    })
    .then((reply) => {
      res.redirect(`/tweets/${req.body.tweetId}/replies`)
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