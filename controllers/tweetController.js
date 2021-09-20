const helpers = require('../_helpers')
const db = require('../models')
const tweet = require('../models/tweet')
const { Op } = require("sequelize")
const { sequelize } = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const tweetController = {
  //貼文相關
  //顯示所有貼文
  getTweets: (req, res) => {
    const currentUser = helpers.getUser(req)

    return Promise.all([
      Tweet.findAll({
      include: [
        { model:User , attributes:['id', 'name', 'avatar', 'account']}, 
        { model:Like },
        { model:Reply}
      ],
      order: [['createdAt', 'DESC']],
    }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      })
     
    ]) 
    .then(([tweets,users]) => {
        tweets = tweets.map( r => ({
        ...r.dataValues,
        User: r.User.dataValues,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id),
        Likes:r.Likes.length,
        Replies: r.Replies.length,
      }))

      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
    
      return res.render('index', {
        tweets:tweets,
        topUsers,
        currentUser
      })
    })
  },

  //新增一則貼文(要改api)
  postTweets: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', "請輸入貼文內容")
      return res.redirect('/tweets')
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    })
      .then((tweet) => {
        req.flash('success_messages', 'tweet was successfully created')
        res.redirect('back')
      })
  },
  //顯示特定貼文(要改api)
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [User,
        { model: Like, include: [User] },
        { model: Reply, include: [User] }
      ]
    })
      .then(tweet => {
        return res.render('tweet', {
          tweet: tweet.toJSON(),
          currentUser: helpers.getUser(req),
          like: req.user.LikedTweets.map(d => d.id).includes(tweet.id)
        })
      })
  },

  //回文相關
  //回覆特定貼文
  createReply: (req, res) => {
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.body.TweetId,
      UserId: req.user.id
    })
      .then((reply) => {
        res.redirect('back')
        // res.redirect(`/tweets/${req.body.TweetId}`)
      })
  },
  //顯示特定貼文回覆
  getTweetReplies: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [Reply]
    })
      .then(tweet => {
        return res.render('replyFake', {
          tweet: tweet.toJSON()
        })
      })

  },

  //Like & Unlike
  //喜歡特定貼文
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    })
      .then((like) => {
        return res.redirect('back')
      })
  },
  //取消喜歡特定貼文
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        like.destroy()
          .then(tweet => {
            return res.redirect('back')
          })
      })
  }

}


module.exports = tweetController