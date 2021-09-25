const db = require('../models')
const user = require('../models/user')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')

const tweetController = {
  // 首頁
  getTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        include: [User, Reply,
          { model: User, as: 'LikedUsers' }
        ],
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ]
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" }
      }),
    ]).then(([tweets, users]) => {

      const topUsers = helpers.getTopUsers(req, users)

      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        id: tweet.id,  //拿到tweet的id
        description: tweet.description,
        createdAt: tweet.createdAt,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(req.user.id),
      }))

      return res.render('tweets', {
        tweets: data,
        topUsers,
        theUser: helpers.getUser(req).id
      })
    })
  },

  postTweet: async (req, res) => {
    let { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不能空白！')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不能為超過140字！')
      return res.redirect('back')
    }
    await Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    res.redirect('/tweets')
  },
  getTweet: async (req, res) => {
    // return Tweet.findByPk(req.params.id, {
    //   include: [
    //     ,
    //     // { model: User, as: 'Followers' },
    //     // { model: User, as: 'LikedUsers' },
    //     // { model: Reply, include: [User] }
    //   ]
    // })
    //   // .then(tweet => tweet.increment('viewCounts'))
    //   .then(tweet => {
    //     // const isFollowed = tweet.Followers.map(d => d.id).includes(req.user.id)
    //     // const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
    //     return res.render('tweet', {
    //       tweet: tweet.toJSON(),
    //       // isFollowed,
    //       // isLiked
    //     })
    //   })
    // console.log(req.params.id)
    try {
      const tweet = await Tweet.findByPk(
        req.params.id, {
        include: [
          User,
          { model: Reply, include: [User] },
          { model: User, as: 'LikedUsers' }
        ],
        order: [['Replies', 'createdAt', 'DESC']]
      })
      // console.log('我是req.user.LikedTweets:', req.user.LikedTweets)
      const isLiked = req.user.LikedTweets.map(d => d.id).includes(tweet.id)
      return res.render('tweet', { tweet: tweet.toJSON(), isLiked })
    } catch (e) {
      console.log(e.message)
    }
  },
}

module.exports = tweetController
