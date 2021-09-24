const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
// const Secondreply = db.Secondreply
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
    })
      .then((tweets) => {
        Like.findAll({
          where: { UserId: helpers.getUser(req).id },
          raw: true,
          nest: true,
        }).then((likes) => {
          likes = likes.map((like) => like.TweetId)
          tweets = tweets.map((t) => ({
            ...t,
            tweetIsLiked: likes.includes(t.id),
          }))
          tweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
          res.render('tweets', {
            tweets: tweets,
          })
        })
      })
      .catch((err) => res.send(err))
  },

  postTweet: (req, res) => {
    if (!req.body.description.length) {
      req.flash('error_messages', '請新增內容後再發推文。')
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages', '推文過長，請輸入140字內的推文。')
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description,
    })
      .then((tweet) => res.redirect('/tweets'))
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
    const tweetId = Number(req.params.tweetId)
    Tweet.findAll({
      where: { id: tweetId },
      raw: true,
      nest: true,
      include: [User, Like, { model: Reply, include: [User] }],
    })
      .then((tweets) => {
        // 剔除重複query的 replies 和 likes
        const tweet = {
          ...tweets[0],
          replies: [
            ...new Set(
              tweets.map((item) => {
                return JSON.stringify(item.Replies)
              })
            ),
          ].map((item) => JSON.parse(item)),
          Likes: [...new Set(tweets.map((t) => t.Likes.UserId))],
        }
        const tweetIsLiked = tweet.Likes.includes(helpers.getUser(req).id)
        const secondReplies = [] // 用於製作modal，與tweet.secondReplies 用途不同
        return Promise.all(
          Array.from({ length: tweet.replies.length }, (_, i) =>
            // 找到每個 replies 所有的 secondReply，加到tweet.replies.secondReplies，以便於 template 巢狀讀取
            Secondreply.findAll({
              where: { ReplyId: tweet.replies[i].id },
              raw: true,
              nest: true,
              include: [User, Like, { model: Reply, include: [User] }],
            })
              .then((replies) => {
                // replies 是某一個第一層回覆底下的所有回覆 root-1-many
                replies.forEach((index) => {
                  if (index.Likes.UserId === helpers.getUser(req).id) {
                    index.secondReplyIsLiked = true
                  } else {
                    index.secondReplyIsLiked = false
                  }
                  delete index.Likes
                })
                // 過濾掉重複資訊
                replies = [
                  ...new Set(
                    replies.map((item) => {
                      return JSON.stringify(item)
                    })
                  ),
                ].map((item) => JSON.parse(item))
                tweet.replies[i].secondReplies = replies
                secondReplies.push(replies) // 用於製作 Modal
              })
              .then(() => {
                // 把每個replies的id拿去Like查詢，看看user有沒有Like過，將結果紀錄在tweet.replies.replyIsLike中
                return Like.findAll({
                  where: { ReplyId: tweet.replies[i].id },
                  raw: true,
                  nest: true,
                }).then((likes) => {
                  likes = likes.map((like) => like.UserId)
                  const replyIsLiked = likes.includes(helpers.getUser(req).id)
                  tweet.replies[i].replyIsLiked = replyIsLiked
                })
              })
              .catch((err) => console.log(err))
          )
        )
          .then(() => {
            res.render('reply', {
              tweet, // 內含 tweet 基本資料
              replies: tweet.replies[0].id === null ? null : tweet.replies, // 第一層回覆 ＋ 第二層回覆
              currentUserId: helpers.getUser(req).id,
              tweetIsLiked, // 是否喜歡過該 tweet
              secondReplies: secondReplies.flat(), // 第二層回覆
            })
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => res.send(err))
  },
  postReply: (req, res) => {
    const tweetId = Number(req.params.tweetId)
    const comment = req.body.comment
    if (!comment.length) {
      req.flash('error_messages', '請新增內容後再推你的回覆。')
      res.redirect('back')
    } else {
      return Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: tweetId,
        comment: comment,
      })
        .then(() => {
          return Tweet.findByPk(tweetId)
            .then((tweet) => {
              tweet.increment('replyCount')
            })
            .then(() => res.redirect('back'))
        })
        .catch((err) => res.send(err))
    }
  },
  postSecondReply: (req, res) => {
    const comment = req.body.comment
    if (!comment.length) {
      req.flash('error_messages', '請新增內容後再推你的回覆。')
      res.redirect('back')
    } else {
      return Secondreply.create({
        UserId: helpers.getUser(req).id,
        ReplyId: Number(req.params.replyId),
        comment: comment,
        replyTo: req.params.replyTo,
      })
        .then(() => {
          return Tweet.findByPk(Number(req.params.tweetId))
            .then((tweet) => {
              tweet.increment('replyCount')
            })
            .then(() => res.redirect('back'))
        })
        .catch((err) => res.send(err))
    }
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
      .catch((err) => res.send(err))
  },
  addLike: (req, res) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweetId) || 0
    const ReplyId = Number(req.params.replyId) || 0
    const SecondreplyId = Number(req.params.secondReplyId) || 0
    return Like.create({
      UserId: UserId,
      TweetId: TweetId,
      ReplyId: ReplyId,
      SecondreplyId: SecondreplyId,
    })
      .then(() => {
        if (SecondreplyId) {
          return Secondreply.findByPk(SecondreplyId).then((reply) =>
            reply.increment('likeCount')
          )
        } else if (ReplyId) {
          return Reply.findByPk(ReplyId).then((reply) =>
            reply.increment('likeCount')
          )
        } else {
          return Tweet.findByPk(TweetId).then((tweet) =>
            tweet.increment('likeCount')
          )
        }
      })
      .then(() => res.redirect('back'))
      .catch((err) => res.send(err))
  },
  removeLike: (req, res) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweetId) || 0
    const ReplyId = Number(req.params.replyId) || 0
    const SecondreplyId = Number(req.params.secondReplyId) || 0
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: TweetId,
        ReplyId: ReplyId,
        SecondreplyId: SecondreplyId,
      },
    })
      .then((like) => {
        return like.destroy()
      })
      .then(() => {
        if (SecondreplyId) {
          return Secondreply.findByPk(SecondreplyId).then((reply) =>
            reply.decrement('likeCount')
          )
        } else if (ReplyId) {
          return Reply.findByPk(ReplyId).then((reply) =>
            reply.decrement('likeCount')
          )
        } else {
          return Tweet.findByPk(TweetId).then((tweet) =>
            tweet.decrement('likeCount')
          )
        }
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch((err) => res.send(err))
  },
}

module.exports = tweetController
