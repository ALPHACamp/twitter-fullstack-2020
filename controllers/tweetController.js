const { User, Tweet, Reply } = require('../models')
const pageLimit = 10
const tweetController = {
  getTweets: async (req, res, next) => {
    let offset = 0
    const whereQuery = {}
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    // if(req.query)

    try {
      const [result] = await Promise.all([
        Tweet.findAndCountAll({
          raw: true,
          nest: true,
          limit: pageLimit,
          where: whereQuery,
          offset: offset,
          order: [['createdAt', 'DESC']],
          include: [User]
        })
      ])

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(t => ({
        ...t,
        content: t.content.substring(0, 50)
      }))
      console.log(`data:${data}`)
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
    }
  },
  postTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: req.user.id,
      content: req.body.content,
      likes: 0
    })
      .then((tweet) => {
        req.flash('success_messages', 'Tweet was successfully created')
        res.redirect('/tweets')
      })
      .catch(err => console.log(err))
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    })
      .then((tweet) => {
        return res.render('tweet', {
          tweet: tweet.toJSON()
        })
      })
  },
  editTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, { raw: true }).then(tweet => {
      return res.render('tweet', { tweet: tweet })
    })
  },
  putTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }

    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        Tweet.update({
          UserId: req.user.id,
          content: req.body.content,
          likes: req.body.likes
        })
          .then((tweet) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/tweets')
          })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
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
