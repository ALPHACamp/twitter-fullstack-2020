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
              user: req.user,
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
            { model: Reply, include: [User, { model: User, as: 'LikedUsers' }] },
            { model: User, as: 'LikedUsers' }
          ],
        })
          .then((tweets) => {
            // 剔除重複query的 replies 和 likedUsers
            const tweet = {
              ...tweets[0],
              replies: [...new Set(tweets.map(item => { return JSON.stringify(item.Replies) }))].map(item => JSON.parse(item)),
              likedUsers: [...new Set(tweets.map(t => t.LikedUsers.Like.UserId))],
            }
            const tweetIsLiked = tweet.likedUsers.includes(req.user.id)
            let secondReplies = []  // 用於製作modal，與tweet.secondReplies 用途不同

            return Promise.all(Array.from(
              { length: tweet.replies.length },
              (_, i) =>
                // 找到每個 replies 所有的 secondReply，加到tweet.replies.secondReplies，以便於 template 巢狀讀取
                Secondreply.findAll({
                  where: { ReplyId: tweet.replies[i].id },
                  raw: true,
                  nest: true,
                  include: [
                    User,
                    { model: Reply, include: [User] },
                    { model: User, as: 'LikedUsers' }
                  ]
                })
                  .then((replies) => {
                    // replies 是某一個第一層回覆底下的所有回覆 root-1-many
                    replies.forEach(index => {
                      if (index.LikedUsers.Like.UserId === req.user.id)
                        index.secondReplyIsLiked = true
                      else {
                        index.secondReplyIsLiked = false
                      }
                    })
                    replies.forEach(index => {
                      delete index.LikedUsers
                    })
                    // 過濾掉重複資訊
                    replies = [...new Set(replies.map(item => { return JSON.stringify(item) }))].map(item => JSON.parse(item))
                    tweet.replies[i].secondReplies = replies
                    secondReplies.push(replies)  // 用於製作 Modal
                  })
                  .then(() => {
                    // 把每個replies的id拿去Like查詢，看看user有沒有Like過，將結果紀錄在tweet.replies.replyIsLike中
                    return Like.findAll({
                      where: { ReplyId: tweet.replies[i].id }, raw: true, nest: true
                    })
                      .then((likes) => {
                        likes = likes.map(like => like.UserId)
                        const replyIsLiked = likes.includes(req.user.id)
                        tweet.replies[i].replyIsLiked = replyIsLiked
                      })
                  })
                  .catch(err => console.log(err))
            ))
              .then(() => {
                res.render('reply', {
                  tweet, //內含 tweet 基本資料
                  replies: tweet.replies[0].id === null ? null : tweet.replies,  // 第一層回覆 ＋ 第二層回覆
                  currentUserId: req.user.id,
                  tweetIsLiked,  //是否喜歡過該 tweet
                  recommendFollowings: users,  // 右欄
                  secondReplies: secondReplies.flat()  // 第二層回覆
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
  addLike: (req, res) => {
    const UserId = req.user.id
    const TweetId = Number(req.params.tweetId)
    const ReplyId = Number(req.params.replyId)
    const SecondreplyId = Number(req.params.secondReplyId)
    console.log(TweetId, ReplyId, SecondreplyId)

    return Like.create({
      UserId: UserId, TweetId: TweetId, ReplyId: ReplyId, SecondreplyId: SecondreplyId
    })
      .then(() => {
        if (SecondreplyId) {
          return Secondreply.findByPk(SecondreplyId)
            .then(reply => reply.increment('likeCount'))
        }
        else if (ReplyId) {
          return Reply.findByPk(ReplyId)
            .then(reply => reply.increment('likeCount'))
        }
        else {
          return Tweet.findByPk(TweetId)
            .then(tweet => tweet.increment('likeCount'))
        }
      })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))

  },
  removeLike: (req, res) => {
    const UserId = req.user.id
    const TweetId = Number(req.params.tweetId)
    const ReplyId = Number(req.params.replyId)
    const SecondreplyId = Number(req.params.secondReplyId)
    console.log(TweetId, ReplyId, SecondreplyId)
    return Like.findOne({
      where: {
        UserId: UserId, TweetId: TweetId, ReplyId: ReplyId, SecondreplyId: SecondreplyId
      }
    })
      .then((like) => {
        return like.destroy()
      })
      .then(() => {
        if (SecondreplyId) {
          return Secondreply.findByPk(SecondreplyId)
            .then(reply => reply.decrement('likeCount'))
        }
        else if (ReplyId) {
          return Reply.findByPk(ReplyId)
            .then(reply => reply.decrement('likeCount'))
        }
        else {
          return Tweet.findByPk(TweetId)
            .then(tweet => tweet.decrement('likeCount'))
        }
      })
      .then(() => res.redirect('back'))
      .catch((err) => res.send(err))
  },
}



module.exports = tweetController
