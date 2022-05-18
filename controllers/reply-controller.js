const { Op } = require("sequelize")
const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const { catchTopUsers} = require('../helpers/sequelize-helper')
const helpers= require('../_helpers')
const replyController = {
  getReplies: (req, res, next) => {
    const TweetId = req.params.id
    return Promise.all([ 
      Tweet.findByPk(TweetId, {
        include: {model: User},raw:true,nest:true
      })
      ,catchTopUsers(req)
      ,Reply.findAndCountAll({
        where:{TweetId},include:{
          model:User,attributes:['id',"name","account",'avatar']
        },raw:true,nest:true
      }),Like.findAndCountAll({
        where:{
          TweetId
        },raw:true,nest:true
      })
    ])
    .then(([tweet,topUsers,replies,likes]) => {
      if (!tweet) {
        throw new Error('This tweet id do not exist')
      }
      likes.isLiked = likes.rows.some(like=>like.UserId===helpers.getUser(req).id)
      // res.json(tweet)
      res.render('tweet',{tweet,topUsers,replies,likes})
    }).catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const TweetId = req.params.id
    const { comment } = req.body
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          throw new Error('This tweet id do not exist')
        }
        return Reply.create({
          TweetId,
          UserId: helpers.getUser(req).id,
          comment
        })
      }).then(() => {
        res.redirect('/')
      }).catch(err => next(err))
  }
}
module.exports = replyController