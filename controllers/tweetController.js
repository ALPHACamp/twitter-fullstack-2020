const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getHomePage: (req, res) => {
    // 推薦追蹤名單 (follower人數top6)
    User.findAll({
      include: [{ model: User, as: 'Followers' }],
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: user.Followers.map((er) => er.id).includes(req.user.id),
      }))
      // 去除掉自己
      users = users.filter((user) => user.id !== req.user.id)
      users = users
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 6)
      // 顯示已追蹤人的tweets
      const followings = req.user.Followings.map((user) => user.id)
      followings.push(req.user.id)
      Tweet.findAll({
        where: { UserId: followings },
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC']],
      })
        .then((tweets) => {
          res.render('home', {
            tweets: tweets,
            recommendFollowings: users,
            currentUserId: Number(req.user.id),
          })
        })
        .catch((err) => res.send(err))
    })
  },
  postTweet: (req, res) => {
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.tweet,
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
    const tweetId = req.params.tweetId
    Tweet.findByPk(tweetId, {
      raw: true,
      nest: true,
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUser' }
      ],
    })
      .then((tweet) => {
        Reply.findAll({
          where: { TweetId: tweet.id },
          raw: true,
          nest: true,
          include: [User],
          order: [['createdAt', 'ASC']],
        }).then((replies) => {
          console.log(tweet.LikedUser)
          res.render('reply', {
            tweet,
            replies,
            currentUserId: req.user.id,
            likeCount: tweet.LikedUser.Like.length || 0
          })
        })
      })
      .catch((err) => res.send(err))
  },
  postReply: (req, res) => {
    const tweetId = Number(req.params.tweetId)

    return Reply.create({
      UserId: req.user.id,
      TweetId: tweetId,
      comment: req.body.reply
    })
      .then(() => {
        return Tweet.findByPk(tweetId)
          .then(tweet => {
            tweet.increment('replyCount')
          })
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.replyId)
      .then((reply) => {
        reply.destroy()
          .then(() => {
            return Tweet.findByPk(req.params.tweetId)
              .then(tweet => {
                tweet.decrement('replyCount')
              })
              .then(() => res.redirect('back'))
          })
          .catch(err => res.send(err))
      })
      .catch(err => res.send(err))
  },
  likeTweet: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: Number(req.params.tweetId),
    })
      .then(() => res.redirect(`back`))
      .catch((err) => res.send(err))
  },
}

module.exports = tweetController
