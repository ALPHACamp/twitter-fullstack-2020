const { User, Tweet, Reply } = require('../models')
const pageLimit = 10
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const tweetController = {
  getTweets: async (req, res, next) => {
    let offset = 0
    const whereQuery = {}
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    try {
      let [tweets, followship] = await Promise.all([
        Tweet.findAndCountAll({
          raw: true,
          nest: true,
          limit: pageLimit,
          where: whereQuery,
          offset: offset,
          order: [['createdAt', 'DESC']],
          include: [User]
        }),
        User.findAll({
          where: {
            is_admin: false,
            id: { [Op.ne]: req.user.id }
          },
          include: [{ model: User, as: 'Followers' }]
        })
      ])

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(tweets.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      tweets = tweets.rows.map(t => ({
        ...t,
        content: t.content.substring(0, 50),
        isLiked: req.user.LikedTweet.some(d => d.id === t.id)
      }))

      followship = followship.map(followships => ({
        ...followships.dataValues,
        FollowerCount: followships.Followers.length,
        isFollowed: req.user.Followings.some(d => d.id === followships.id),
      }))
      followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount)

      return res.render('tweets', {
        tweets,
        followship,
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
    } else if (req.body.content.length == 0) {
      req.flash('error_messages', "Please enter some content !")
      return res.redirect('back')
    } else if (req.body.content.length > 140) {
      req.flash('error_messages', "Content is over limit!")
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

      const isLiked = tweet.LikedbyUser.map(d => d.id).includes(req.user.id)
      res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked
      })
    } catch (error) {
      next(error)
    }
  },
  editTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then(tweet => {
      return res.render('tweet', { tweet: tweet.toJSON() })
    })
  },
  putTweet: (req, res) => {
    if (!req.body.content) {
      req.flash('error_messages', "Content didn't exist")
      return res.redirect('back')
    }

    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.update({
          UserId: req.user.id,
          content: req.body.content,
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
