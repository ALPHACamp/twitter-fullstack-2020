const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    return Promise.all([
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAndCountAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [
          User
        ]
      })
    ]).then(([users, tweets]) => {
      users = users.map(user => ({
            ...user.dataValues,
            FollowerCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
        }))
      tweets = tweets.rows.map(r => ({
        ...r,
        description: r.description.substring(0,50),
        // isLiked: r.LikedbyUser.map(d => d.id).includes(helpers.getUser(req).id)
        // isLiked: helpers.getUser(req).LikedTweet.map(d => d.id).includes(r.id),
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      return res.render('tweets', {
        tweets: tweets,
        users: users
      })
    })
  },

  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '推文內容不存在')
      return res.redirect('/tweets')
    } else if (req.body.description.trim().length === 0) {
      req.flash('error_messages', '請輸入推文內容!')
      return res.redirect('/tweets')
    } else if (req.body.description.length > 140) {
      req.flash('error_messages', '推文超過140字數限制')
      return res.redirect('/tweets')
    }
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description,
      })
        .then((tweet) => {
          req.flash('success_messages', '成功發布推文')
          res.redirect('/tweets') 
        })
  },

  getTweet: (req, res) => {
    return Promise.all([
      Tweet.findByPk(req.params.id, {
        include: [
          User,
          { model: Reply, include: User },
          { model: User, as: 'LikedbyUser'}
        ],
        order: [[Reply, 'createdAt', 'DESC']]
      }),
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ]).then(([tweet, users]) => {
      users = users.map(user => ({
            ...user.dataValues,
            FollowerCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
            // isFollowing: helpers.getUser(req).Followers.map(d => d.id).includes(user.id),
        }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      const isLiked = tweet.LikedbyUser.map(d => d.id).includes(helpers.getUser(req).id)
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked: isLiked,
        users: users
      })
    })
  }
}

module.exports = tweetController