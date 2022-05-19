const { getOffset, getPagination } = require('../helpers/pagination-helper')
const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const { catchTopUsers} = require('../helpers/sequelize-helper')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    const limit = Number(req.query.limit) || 20
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)
    return Promise.all([ Tweet.findAndCountAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'avatar','account'],
      }, {
        model: Like,attributes:[],duplicating:false
      }, {
        model: Reply,attributes:[],duplicating:false
      }],
      attributes:{include:[
        [sequelize.fn('COUNT',sequelize.fn('DISTINCT',sequelize.col('Replies.id'))),'totalReply'],
        [sequelize.fn('COUNT',sequelize.fn('DISTINCT',sequelize.col('Likes.id'))),'totalLike'],
        [sequelize.fn('MAX',sequelize.fn('IF',sequelize.literal('`Likes`.`UserId`-'+helpers.getUser(req).id+'=0'),1,0)),"isLiked"]
      ]},
      distinct:true,group:'Tweet.id',
      order: [['createdAt','DESC']],limit,offset,
      raw:true,nest:true
      }),
      catchTopUsers(req)
    ])
    .then(([tweets,topUsers])  => {
      res.render('index',{tweets:tweets.rows,topUsers,pagination: getPagination(limit, page, tweets.count.length)})
    }).catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const description = req.body.description
    if(!(description.length<=140)){
      req.flash('error_messages','String length exceeds range' )
      return res.redirect('/tweets')
    }
    return Tweet.create({
      description,
      UserId
    })
      .then(() => res.redirect(`${req.get('Referrer')}`))
      .catch(err => next(err))
  },
}
module.exports = tweetController
