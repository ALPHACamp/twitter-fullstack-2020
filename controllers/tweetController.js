const helpers = require('../_helpers')
const db = require('../models')
const tweet = require('../models/tweet')
// const { Op } = require("sequelize")
const { sequelize } = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  //貼文相關
  //顯示所有貼文
  getTweets: (req, res) => {
    const UserId = req.user.id

    return Promise.all([
      Tweet.findAll({
        include: [User, { model: Like, include: [Tweet] }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      // replies = sequelize.query('select `TweetId`, COUNT(`id`) AS `replycount` from `replies` GROUP BY `TweetId`;', {
      // type: sequelize.QueryTypes.SELECT
      // }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })
    ])
      .then(([tweets, users]) => {

        const data = tweets.map(r => ({
          ...r.dataValues,
          id: r.id,
          User: r.User,
          description: r.description,
          createdAt: r.createdAt,
          isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id),
          // replyCount: replies.filter(d => d.TweetId === r.id)[0].replycount
        }))
        //整理popular要用的資料 
        const popular = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          myself: Boolean(user.id === UserId),
          isFollowed: req.user.Followings.map(d => d.id).includes(UserId)
        }))
        //排除admin
        const normal = popular.filter(d => d.role === 'normal')

        //區分已followed和未followed並排序
        const isFollowed = normal.filter(d => d.isFollowed === true).sort((a, b) => b.FollowerCount - a.FollowerCount)

        const unFollowed = normal.filter(d => d.isFollowed === false).sort((a, b) => b.FollowerCount - a.FollowerCount)

        console.log(unFollowed)
        return res.render('index', {
          data: data,
          isFollowed: isFollowed,
          unFollowed: unFollowed,
          currentUser: helpers.getUser(req)
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
  }
,

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