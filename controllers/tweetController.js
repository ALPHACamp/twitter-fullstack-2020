const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Followship = db.Followship

const helper = require('../_helpers')

const maxDescLen = 50

const tweetController = {
  // 首頁
  getTweets: async (req, res) => {
    return Promise.all([
      Tweet.findAndCountAll({
        raw: true,
        nest: true,
        include: [User],
      }),
      User.findAndCountAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ]).then(([tweets, users]) => {
      // 列出 追隨數前十名的使用者
      const topUsers = 
      users.rows.map(user =>({
        ...user.dataValues,
        FollowedCount: user.Followers.length,
        isFollowed: req.user.Followers.map(d => d.id).includes(user.id)
      }))
      .sort((a, b) => b.FollowedCount - a.FollowedCount)
      .slice(0, 10)
      
      const data = tweets.rows.map(tweet => ({
        ...tweet.dataValues,
        likedCount: req.user.LikedTweets.length,
        description: tweet.description,
        createdAt: tweet.createdAt,
        userName: tweet.User.name,
        userAccount: tweet.User.account,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(tweet.id) // 推文是否被喜歡過
      }))
      User.findAll({
        raw: true,
        nest: true,
        include: [Tweet]
      })
        .then((user) => {
          return res.render('home', {
            tweets: data,
            users: topUsers
          })
        })
    })

    
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
        include: [User]
      })
      return res.render('tweet', { tweet: tweet.toJSON() })
    } catch (e) {
      console.log(e.message)


    }
  },
}

module.exports = tweetController
