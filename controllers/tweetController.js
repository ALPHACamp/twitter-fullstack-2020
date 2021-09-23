const helpers = require('../_helpers')
const db = require('../models')
const tweet = require('../models/tweet')
const { Op } = require("sequelize")
const { sequelize } = require('../models')
const tweetService = require('../services/tweetService')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship


const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, data => {
      return res.render('index', data)
    })
  },

  postTweets: (req, res) => {
    tweetService.postTweets(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('back')
    })
  },

  getTweet: (req, res) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findByPk(req.params.id, {
        include: [User,
          { model: Like, include: [User] },
          { model: Reply, include: [User] }
        ]
      }), Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      })
    ])
      .then(([tweet, users]) => {
        //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
        const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')
        const topUsers = normalUsers.map(user => ({
          id: user.FollowingLinks.id,
          name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
          account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account) : 'noAccount',
          avatar: user.FollowingLinks.avatar,
          followersCount: user.count,
          isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
          isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
        }))
        return res.render('tweet', {
          tweet: tweet.toJSON(),
          currentUser: helpers.getUser(req),
          like: currentUser.LikedTweets ? currentUser.LikedTweets.map(d => d.id).includes(tweet.id) : false,
          topUsers
        })
      })
  },

  createReply: (req, res) => {
    const currentUser = helpers.getUser(req)
    const currentUserId = currentUser.id
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.body.TweetId,
      UserId: currentUserId
    })
      .then((reply) => {
        res.redirect('back')
      })
  },

  addLike: async (req, res) => {

    try {
      const currentUserId = helpers.getUser(req).id
        await Like.findOrCreate({
              where: {
                UserId: currentUserId,
                TweetId: req.params.id
              }
            })
          .then((like) => {
            return res.redirect('back')
        })
    } catch (error) {
      console.log(error)
      res.render('/index', { Error })
    }
  },

  removeLike: async (req, res) => {
    try {
      const currentUserId = helpers.getUser(req).id
      await Like.findOne({
        where: {
          UserId: currentUserId,
          TweetId: req.params.id
        }
      })
        .then(like => {
          like.destroy()
            .then(tweet => {
              return res.redirect('back')
            })
        })
    } catch (error) {
      console.log(error)
      res.render('/index', { Error })
    }
  }
}

module.exports = tweetController