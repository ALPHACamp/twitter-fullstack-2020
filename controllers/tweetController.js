const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const Reply = db.Reply
const ReplyComment = db.ReplyComment
let more = 10
const helpers = require('../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        Like,
        Reply,
        { model: User, include: [{ model: User, as: 'Followers' }] }],
      order: [['updatedAt', 'DESC']]
    }).then(tweets => {
      const loginUser = helpers.getUser(req)

      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues ? tweet.dataValues.Likes.length : null,
        repliesCount: tweet.dataValues ? tweet.dataValues.Replies.length : null,
        user: tweet.dataValues ? tweet.dataValues.User.dataValues : null,
        followerId: tweet.dataValues ? tweet.dataValues.User.dataValues.Followers.map(followers => followers.dataValues.id) : null,
        isLiked: loginUser.Likes.map(like => like.TweetId).includes(tweet.id)
      }))

      //filter the tweets to those that user followings & user himself
      tweetFollowings = []
      tweets.forEach(tweet => {
        if (tweet.UserId === loginUser.id) {
          tweetFollowings.push(tweet)
        }
        tweet.followerId.forEach(followerId => {
          if (followerId === loginUser.id) {
            tweetFollowings.push(tweet)
          }
        })
      })

      //Top 10 followers
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
        .then(users => {
          users = users.map(user => ({
            ...user.dataValues,
            isFollowing: user.Followers.map(follower => follower.id).includes(loginUser.id)
          }))

          users.forEach((user, index, arr) => {
            if (user.role === "admin") {
              arr.splice(index, 1);
            }
          })

          //sort by the amount of the followers
          users.sort((a, b) => {
            return b.Followers.length - a.Followers.length
          })

          //more followers
          if (req.query.more) {
            more = more + 10
          }
          users = users.slice(0, more)

          return res.render('tweets', { tweetFollowings, loginUser, users })
        })
    })

  },

  postTweets: (req, res) => {
    const { description } = req.body
    if (!description) {
      req.flash('error_messages', '貼文不得為空白')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '貼文字數不得超過140字')
      return res.redirect('/tweets')
    }
    else {
      Tweet.create({
        description,
        UserId: helpers.getUser(req).id
      })
        .then(tweet => {
          return res.redirect('/tweets')
        })
    }
  },

  getReply: (req, res) => {
    Tweet.findByPk(req.params.tweetId,
      {
        include: [
          Like,
          User,
          {
            model: Reply, include: [
              User,
              Like,
              { model: ReplyComment, include: [User] }
            ]
          }
        ]
      }
    )
      .then(tweet => {
        tweet = tweet.toJSON()
        const loginUser = helpers.getUser(req)

        //like and dislike tweet
        const isLikedTweet = loginUser.Likes.map(likes => likes.TweetId).includes(tweet.id)

        //like and dislike reply
        tweetReplies = tweet.Replies.map(reply => ({
          ...reply,
          isLikedReply: reply.Likes.map(like => like.UserId).includes(loginUser.id)
        }))

        tweet.Replies.sort((a, b) => {
          return b.updatedAt - a.updatedAt
        })

        //Top 10 followers
        User.findAll({
          include: [{ model: User, as: 'Followers' }]
        })
          .then(users => {
            users = users.map(user => ({
              ...user.dataValues,
              isFollowing: user.Followers.map(follower => follower.id).includes(loginUser.id)
            }))

            users.forEach((user, index, arr) => {
              if (user.role === "admin") {
                arr.splice(index, 1);
              }
            })

            //sort by the amount of the followers
            users.sort((a, b) => {
              return b.Followers.length - a.Followers.length
            })

            //more followers
            if (req.query.more) {
              more = more + 10
            }
            users = users.slice(0, more)

            return res.render('tweet', { tweet, loginUser, isLikedTweet, tweetReplies, users })
          })
      })
  },

  postReply: (req, res) => {
    const { comment } = req.body
    if (!comment) {
      req.flash('error_messages', '留言不得為空白')
      return res.redirect(`/tweets/${req.params.tweetId}/replies`)
    }
    if (comment.length > 100) {
      req.flash('error_messages', '留言字數不得超過100字')
      return res.redirect('back')
    }
    else {
      Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId,
        comment
      })
        .then(reply => {
          return res.redirect(`/tweets/${reply.TweetId}/replies`)
        })
    }
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.destroy()
          .then(tweet => {
            return res.redirect('back')
          })
      })
  },

  deleteReply: (req, res) => {
    Reply.findByPk(req.params.replyId)
      .then(reply => {
        reply.destroy()
          .then(reply => {
            return res.redirect('back')
          })
      })
  },

  editTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        const { description } = req.body
        if (!description) {
          req.flash('error_messages', '貼文不得為空白')
          return res.redirect('back')
        }
        if (description.length > 140) {
          req.flash('error_messages', '貼文字數不得超過140字')
          return res.redirect('back')
        }
        else {
          tweet.update({
            description
          })
            .then(tweet => {
              req.flash('success_messages', '已成功更新貼文')
              return res.redirect('back')
            })
        }
      })
  },

  editReply: (req, res) => {
    Reply.findByPk(req.params.replyId)
      .then(reply => {
        const { comment } = req.body
        if (!comment) {
          req.flash('error_messages', '留言不得為空白')
          return res.redirect('back')
        }
        if (comment.length > 100) {
          req.flash('error_messages', '留言字數不得超過100字')
          return res.redirect('back')
        }
        else {
          reply.update({
            comment
          })
            .then(reply => {
              req.flash('success_messages', '已成功更新留言')
              return res.redirect('back')
            })
        }
      })
  }
}

module.exports = tweetController