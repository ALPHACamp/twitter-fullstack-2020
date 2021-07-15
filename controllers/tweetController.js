const { User, Tweet, Reply } = require('../models')
const pageLimit = 10
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    let offset = 0
    const whereQuery = {}
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    try {
      const result = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        limit: pageLimit,
        where: whereQuery,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [User]
      })
  
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      return res.render('tweets', {
        tweets: data,
        page,
        pages: pages <= 1 ? 'invisible' : '',
        totalPage,
        prev,
        next
      })
    } catch (error) {
      next(error)
      // console.error(error)
    }
  },
  postTweet: async (req, res, next) => {
    if (!req.body.description) {
      req.flash('error_messages', '推文內容不存在')
      return res.redirect('/')
    } else if (req.body.description.length === 0) {
      req.flash('error_messages', '請輸入推文內容!')
      return res.redirect('/')
    } else if (req.body.description.length > 140) {
      req.flash('error_messages', '推文超過字數限制')
      return res.redirect('/')
    }
    try {
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description,
        replyCount: 0,
        likes: 0
      })
        .then(() => {
          req.flash('success_messages', '推文成功發布！')
          res.redirect('/')
        })
    } catch (error) {
      next(error)
      console.error(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User,
          { model: Reply, include: User },
          { model: User, as: 'LikedbyUser' }
        ],
        order: [[Reply, 'createdAt', 'DESC']]
      })
      if (!tweet) throw new Error('Tweet is not found!')

      const isLiked = tweet.LikedbyUser.map(d => d.id).includes(helpers.getUser(req).id)
      res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked
      })
    } catch (error) {
      next(error)
      // console.error(error)
    }
  },
  editTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then(tweet => {
      return res.render('tweet', { tweet: tweet.toJSON() })
    })
  },
  putTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '推文不存在!')
      return res.redirect('/')
    }

    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        Tweet.update({
          UserId: helpers.getUser(req).id,
          description: req.body.description,
          likes: req.body.likes
        })
          .then(() => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/tweets')
          })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then(() => {
            res.redirect('/tweets')
          })
      })
  },
  getFeeds: (req, res) => {
    return Tweet.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    }).then(tweets => {
      Reply.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Tweet]
      }).then(replies => {
        return res.render('feeds', {
          tweets,
          replies
        })
      })
    })
  }
}
module.exports = tweetController
