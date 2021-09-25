const db = require('../models')
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
      // console.log('我是helpers.getUser(req)',helpers.getUser(req))
      // 列出 追隨數前十名的使用者
      const topUsers =
        users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        likedCount: helpers.getUser(req).LikedTweets.length,
        description: tweet.description,
        createdAt: tweet.createdAt,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(tweet.id), // 推文是否被喜歡過
        likedUsers: tweet.LikedUsers
      }))

      return res.render('tweets', {
        tweets: data,
        users: topUsers,
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
    //     // const isFollowed = tweet.Followers.map(d => d.id).includes(helpers.getUser(req).id)
    //     // const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
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
      // console.log('我是helpers.getUser(req).LikedTweets:', helpers.getUser(req).LikedTweets)
      const isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(tweet.id) 
      return res.render('tweet', { tweet: tweet.toJSON(), isLiked})
    } catch (e) {
      console.log(e.message)
    }
  },
}

module.exports = tweetController
