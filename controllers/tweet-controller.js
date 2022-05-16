const { Op } = require("sequelize")
const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const { catchTopUsers} = require('../helpers/sequelize-helper')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const offset = (page - 1) * limit
    return Promise.all([ Tweet.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'avatar','account'],
        duplicating: false
      }, {
        model: Like,
        attributes: [],
        duplicating: false
      }, {
        model: Reply,
        attributes: [],
        duplicating: false
      }],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'totalLike'],
          [sequelize.fn("MAX", sequelize.fn('IF',sequelize.literal('`Likes`.`userId` - '+helpers.getUser(req).id+' = 0'),1,0)),'isLiked'],
          [sequelize.fn('COUNT', sequelize.col('Replies.id')), 'totalReply']
        ]
      },
      group: 'id', order: [['createdAt', 'DESC']], limit, offset, raw: true, nest: true,
    }),
    catchTopUsers(req)
  ])
    .then(([tweets,topUsers])  => {
      tweets=tweets.map(e=>({
        ...e.toJSON(),
        totalLike : e.Likes.length,
        totalReply : e.Replies.length,
        isLiked : e.Likes.some(f=>f.UserId===helpers.getUser(req).id)
      }))
      // res.json(tweets[0])
      res.render('index',{tweets,topUsers})
    }).catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const description = req.body.description
    if(description.length>140){
      return res.redirect('/tweets')
    }
    return Tweet.create({
      description: req.body.description,
      UserId
    })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  },
}
module.exports = tweetController
