const db = require('../models')
const tweet = require('../models/tweet')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')


const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User, Reply, Like, { model: User, as: 'LikedUsers' }],

      order: [['createdAt', 'DESC']],
    })
      .then((tweets) => {
        const data = tweets.map(r => ({
          ...r.dataValues,
          isLiked: r.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        }))
        return res.render('tweets', {
          tweets: data,
        })

      })
  },

<<<<<<< HEAD
  getTweet: (req, res) => {
=======
  getTweet: (req, res ) => {
>>>>>>> ac8007b939d72d9bfcc524de182880f2d427f63c
    Tweet.findByPk(req.params.id, {
      include: [User,
        { model: Reply, include: [User] },
        { model: Like, include: [User] },
        { model: User, as: 'LikedUsers' },
      ]
    })
      .then(tweet => {
        const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        return res.render('tweet', {
          tweet: tweet.toJSON(),
          isLiked: isLiked
<<<<<<< HEAD
        }),
          done()
=======
        })
>>>>>>> ac8007b939d72d9bfcc524de182880f2d427f63c
      })

  },

  getUser: async (req, res) => {

    const result = await Tweet.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        userId: req.params.id
      },
      distinct: true,
    })
    const tweets = result.rows
    return User.findByPk(req.params.id)
      .then(user => {
        res.render('profile', {
          user: user, tweets
        })
      })
  },
  postTweet: (req, res) => {
    //未輸入字
    if (!req.body.description) {
      req.flash('error_messages', "請輸入內容")
      return res.redirect('back')
    }
    //超過字數
    if (Number(req.body.description.length) > 140) {
      req.flash('error_messages', "推文字數超過140字，請重新輸入！")
      return res.redirect('back')
    }

    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
      .then((tweet) => {
        req.flash('success_messages', '成功新增一則推文！')
        res.redirect('back')
      })
  },

}

module.exports = tweetController