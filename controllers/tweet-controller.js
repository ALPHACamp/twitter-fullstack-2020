const db = require('../models')
const { Tweet, User, Like, Reply, sequelize } = db
const helper = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const offset = (page - 1) * limit
    return Tweet.findAll({
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
        // 'id','description',
        include: [
          [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'totalLike'],
          [sequelize.fn('COUNT', sequelize.col('Replies.id')), 'totalReply']
        ]
      },
      group: 'id',
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      raw: true,
      nest: true
    }).then(tweets => {
      // res.json(tweets)
      res.render('index',{tweets})
    }).catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const UserId = helper.getUser(req).id
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
