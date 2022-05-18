const { getOffset, getPagination } = require('../helpers/pagination-helper')
const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const { catchTopUsers} = require('../helpers/sequelize-helper')
const helpers = require('../_helpers')
const tweet = require("../models/tweet")
const tweetController = {
  getTweets: (req, res, next) => {
    const limit = Number(req.query.limit) || 20
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)
    return Promise.all([ Tweet.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'avatar','account'],
      }, {
        model: Like,
      }, {
        model: Reply,
      }],
      order: [['createdAt', 'DESC']],limit,offset
    }),
    catchTopUsers(req),
    Tweet.findAndCountAll({attributes:['id']})
  ])
    .then(([tweets,topUsers,T])  => {
      const data=tweets.map(e=>({
        ...e.toJSON(),
        totalLike : e.Likes.length,
        totalReply : e.Replies.length,
        isLiked : e.Likes.some(f=>f.UserId===helpers.getUser(req).id)
      }))
      // res.json(t)
      res.render('index',{tweets:data,topUsers,pagination: getPagination(limit, page, T.count)})
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
      .then(() => res.redirect(`${req.get('Referrer')}`))
      .catch(err => next(err))
  },
}
module.exports = tweetController
