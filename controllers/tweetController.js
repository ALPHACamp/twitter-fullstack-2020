const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Secondreply = db.Secondreply
const userController = require('./userController')


const tweetController = {
  getHomePage: (req, res) => {
    userController.getRecommendedUsers(req, res)
      .then((users) => {
        // 顯示所有tweets在首頁
        Tweet.findAll({
          raw: true,
          nest: true,
          include: [
            User,
            { model: User, as: 'LikedUsers' }
          ],
          order: [['createdAt', 'DESC']]
        })
          .then((tweets) => {
            res.render('home', {
              tweets: tweets,
              recommendFollowings: users,
              currentUserId: req.user.id
            })
          })
      })
      .catch(err => res.send(err))
  },
  postTweet: (req, res) => {
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.tweet
    })
      .then(() => res.redirect('/tweets'))
      .catch((err) => res.send(err))
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweetId)
      .then((tweet) => {
        tweet.destroy().then(() => res.redirect('back'))
      })
      .catch((err) => res.send(err))
  },
  getReplyPage: (req, res) => {
    userController.getRecommendedUsers(req, res)
      .then(users => {
        const tweetId = Number(req.params.tweetId)
        Tweet.findAll({
          where: { id: tweetId },
          raw: true,
          nest: true,
          include: [
            User,
            { model: Reply, include: [User] },
            { model: User, as: 'LikedUsers' }
          ],
        })
          .then((tweets) => {
            // 剔除重複query的 replies 和 likedUsers
            const tweet = {
              ...tweets[0],
              replies: [...new Set(tweets.map(item => { return JSON.stringify(item.Replies) }))].map(item => JSON.parse(item)),
              likedUsers: [...new Set(tweets.map(t => t.LikedUsers.Like.UserId))]
            }
            const isLiked = tweet.likedUsers.includes(req.user.id)
            let secondReplies = []
            // 找出 secondReplies 放進 replies 以便於 template 巢狀讀取
            return Promise.all(Array.from(
              { length: tweet.replies.length },
              (_, i) =>
                Secondreply.findAll({
                  where: { ReplyId: tweet.replies[i].id },
                  raw: true,
                  nest: true,
                  include: [User, { model: Reply, include: [User] }]
                })
                  .then((replies) => {
                    tweet.replies[i].secondReplies = replies
                    secondReplies.push(replies)
                  })
                  .catch(err => console.log(err))
            ))
              .then(() => {
                console.log('第一層回覆 replies：', tweet.replies)
                console.log('第二層回覆 secondReplies：', tweet.replies[0].secondReplies)
                console.log('變數secondReplies', secondReplies)
                res.render('reply', {
                  tweet,
                  replies: tweet.replies[0].id === null ? null : tweet.replies,
                  currentUserId: req.user.id,
                  isLiked,
                  recommendFollowings: users,
                  secondReplies: secondReplies.flat()
                })
              })
              .catch(err => console.log(err))
          })
          .catch(err => res.send(err))
      })
      .catch(err => res.send(err))
  },
  postReply: (req, res) => {
    const tweetId = Number(req.params.tweetId)
    return Reply.create({
      UserId: req.user.id,
      TweetId: tweetId,
      comment: req.body.reply,
      replyTo: req.params.replyTo
    })
      .then(() => {
        return Tweet.findByPk(tweetId)
          .then((tweet) => {
            tweet.increment('replyCount')
          })
          .then(() => res.redirect('back'))
      })
      .catch((err) => res.send(err))
  },
  postSecondReply: (req, res) => {
    return Secondreply.create({
      UserId: req.user.id,
      ReplyId: Number(req.params.replyId),
      comment: req.body.reply,
      replyTo: req.params.replyTo
    })
      .then(() => {
        return Tweet.findByPk(Number(req.params.tweetId))
          .then((tweet) => {
            tweet.increment('replyCount')
          })
          .then(() => res.redirect('back'))
      })
      .catch((err) => res.send(err))
  },
  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.replyId)
      .then((reply) => {
        reply
          .destroy()
          .then(() => {
            return Tweet.findByPk(req.params.tweetId)
              .then((tweet) => {
                tweet.decrement('replyCount')
              })
              .then(() => res.redirect('back'))
          })
          .catch((err) => res.send(err))
      })
      .catch(err => res.send(err))
  },
  likeTweet: (req, res) => {
    const tweetId = Number(req.params.tweetId)
    return Like.create({
      UserId: req.user.id,
      TweetId: tweetId,
    })
      .then(() => {
        return Tweet.findByPk(tweetId)
          .then(tweet => tweet.increment('likeCount'))
      })
      .then(() => res.redirect('back'))
      .catch((err) => res.send(err))
  },
  removeLike: (req, res) => {
    const tweetId = Number(req.params.tweetId)
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: tweetId,
      }
    })
      .then((like) => {
        return like.destroy()
          .then(() => {
            return Tweet.findByPk(tweetId)
              .then(tweet => tweet.decrement('likeCount'))
          })
      })
      .then(() => res.redirect('back'))
      .catch((err) => res.send(err))
  }
}



module.exports = tweetController
