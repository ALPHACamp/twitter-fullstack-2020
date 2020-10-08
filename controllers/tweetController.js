const tweetService = require('../services/tweetService')
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const helpers = require('../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t.dataValues,
          isLiked: t.toJSON().Likes.map((i) => i.UserId).includes(helpers.getUser(req).id),
        }))
        const likes = helpers.getUser(req).Likes
        const isLiked = likes ? likes.map((i) => i.id).includes(data.id) : false;
        return res.render('tweets', {
          isLiked: isLiked,
          tweets: data,
          user: helpers.getUser(req)
        })
      })
  },

  postTweets: (req, res) => {
    const tweetText = req.body.tweetText ? req.body.tweetText.trim() : req.body.description.trim()

    if (!tweetText || tweetText.length > 140) return res.redirect('back')
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: tweetText,
    })
      .then(() => {
        req.flash('successFlashMessage', '成功新增推文!')
        return res.redirect('/tweets')
      })
      .catch(() => {
        req.flash('errorFlashMessage', '新增推文失敗!')
        return res.redirect('back')
      })
  },

  postTweetLike: async (req, res) => {
    try {
      const [like, isCreated] = await Like.findOrCreate(
        {
          where: {
            Position: 'tweet',
            PositionId: req.params.id,
            UserId: helpers.getUser(req).id,
          },
          defaults: {
            UserId: helpers.getUser(req).id,
            Position: 'tweet',
            PositionId: req.params.id,
            isLike: true,
          }
        })
      if (isCreated) console.log('postTweetLike success')
      else console.log('postTweetLike already created')
      return res.redirect('back')
    }
    catch {
      console.log('postTweetLike error')
      return res.redirect('back')
    }
  },

  postTweetUnlike: (req, res) => {
    Like.findOne({
      where: {
        Position: 'tweet',
        PositionId: req.params.id,
        UserId: helpers.getUser(req).id,
      }
    })
      .then((like) => {
        if (!like) {
          return Like.findOne({
            where: {
              TweetId: req.params.id,
              UserId: helpers.getUser(req).id,
            }
          })
            .then((testLike) => {
              return testLike.destroy()
                .then(() => { return res.redirect('back') })
            })
        }
        return like.destroy()
          .then(() => { return res.redirect('back') })
          .catch(() => {
            console.log('deleteTweetLike error')
            return res.redirect('back')
          })
      })
      .catch((err) => {
        console.log('@@@', err)
        console.log('queryTweetLike error')
        return res.redirect('back')
      })
  },

  postReplyLike: async (req, res) => {
    try {
      const [like, isCreated] = await Like.findOrCreate(
        {
          where: {
            Position: 'reply',
            PositionId: req.params.id,
            UserId: helpers.getUser(req).id,
          },
          defaults: {
            UserId: helpers.getUser(req).id,
            Position: 'reply',
            PositionId: req.params.id,
            isLike: true,
          }
        })
      if (isCreated) console.log('postReplyLike success')
      else console.log('postReplyLike already created')
      return res.redirect('back')
    }
    catch {
      console.log('postReplyLike error')
      return res.redirect('back')
    }
  },

  postReplyUnlike: (req, res) => {
    Like.findOne({
      where: {
        Position: 'reply',
        PositionId: req.params.id,
        UserId: helpers.getUser(req).id,
      }
    })
      .then((like) => {
        return like.destroy()
          .then(() => { return res.redirect('back') })
          .catch(() => {
            console.log('deleteReplyLike error')
            return res.redirect('back')
          })
      })
      .catch(() => {
        console.log('queryReplyLike error')
        return res.redirect('back')
      })
  },

  postReply: (req, res) => {
    let tweetId = req.params.id
    let replyText = req.body.comment.trim()
    if (!replyText.length) {
      return res.redirect('back')
    } else {
      return Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: tweetId,
        comment: replyText
      })
        .then(() => {
          req.flash('successFlashMessage', '成功回覆推文!')
          return res.redirect('back')
        })
        .catch(() => {
          req.flash('errorFlashMessage', '回覆推文失敗!')
          return res.redirect('back')
        })
    }
  },

  postReplies: (req, res) => {
    let replyId = req.params.rid
    let replyText = req.body.comment.trim()
    if (!replyText.length) {
      return res.redirect('back')
    } else {
      return Reply.create({
        UserId: helpers.getUser(req).id,
        ReplyId: replyId,
        comment: replyText
      })
        .then(() => {
          req.flash('successFlashMessage', '成功回覆推文!')
          return res.redirect('back')
        })
        .catch(() => {
          req.flash('errorFlashMessage', '回覆推文失敗!')
          return res.redirect('back')
        })
    }
  },

  getTweet: (req, res) => {
    console.log('req.params', req.params.id)
    Tweet.findByPk(req.params.id,
      {
        include: [
          Like, User,
          {
            model: Reply, include: [Like, User,
              {
                model: Reply, as: 'followingByReply',
                include: [User, Like]
                // include: [User, Like, { model: Reply, as: 'followingByReply' }]
              }]
          },
        ]
      })
      .then(tweet => {
        // console.log('tweet######', tweet.toJSON().Replies)
        // console.log('tweet######@@@@@@######', tweet.toJSON().Replies[0].followingByReply[0].Likes) //.userId
        const isLiked = tweet.Likes.map((i) => i.UserId).includes(helpers.getUser(req).id)
        const reply = tweet.toJSON().Replies.map(i => {
          i.isLiked = i.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          i.followingByReply.map(j => {
            j.isLiked = j.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          })
          return i
        })
        res.render('tweet', {
          isLiked,
          tweet: tweet.toJSON(),
          reply,
          LocaleDate: tweet.toJSON().updatedAt.toLocaleDateString(),
          LocaleTime: tweet.toJSON().updatedAt.toLocaleTimeString(),
        })
      })

  },

}

module.exports = tweetController