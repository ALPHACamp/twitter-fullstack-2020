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
    if (helpers.getUser(req).role === "admin") {
      return res.redirect('/admin/tweets')
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
            id: { [Op.ne]: helpers.getUser(req).id }
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
        description: t.description.substring(0, 50),
        isLiked: req.user.LikedTweet.map(d => d.id)
          .includes(t.id)
      }))

      followship = followship.map(followships => ({
        ...followships.dataValues,
        FollowerCount: followships.Followers.length,
        isFollowed: req.user.Followings.some(d => d.id === followships.id),
      }))
      followship = followship.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)

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
      console.error(error)
    }
  },
  postTweet: async (req, res) => {
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
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description,
        replyCount: 0,
        likes: 0
      })

      req.flash('success_messages', '推文成功發布！')
      res.redirect('/')
    } catch (error) {
      console.error(error)
    }
  },
  getTweet: async (req, res) => {
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
      console.error(error)
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
