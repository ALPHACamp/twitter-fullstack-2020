const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
// const Secondreply = db.Secondreply
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User, Reply, { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    })
      .then((data) => {
        const tweets = data.map((d) => ({
          ...d.dataValues,
          isLiked: d.LikedUsers.map((i) => i.id).includes(
            helpers.getUser(req).id
          )
        }))
        res.render('tweets', { tweets })
      })
      .catch((err) => console.log(err))
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '貼文不可空白')
      res.redirect('back')
    } else if (req.body.description.length > 140) {
      req.flash('error_messages', '貼文不得超過 140 個字')
      res.redirect('back')
    } else {
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description
      })
        .then((tweet) => {
          return res.redirect('/tweets')
        })
        .catch((error) => console.log(error))
    }
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        like.destroy().then(() => {
          return res.redirect('back')
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  getReplyPage: async (req, res) => {
    try {
      const userId = req.params.userId
      const popularUser = await userService.getPopular(req, res)
      const profileUser = await userService.getProfileUser(req, res)

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id', 'account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      res.render('user/reply', {
        status: 200,
        profileUser,
        popularUser,
        replies
      })
    } catch (err) {
      res.status(302)
      console.log('getReplies err')
      req.flash('error_messages', '讀取回覆失敗')
      return res.redirect('back')
    }
  },
  postReply: (req, res) => {
    if (req.body.comment.length > 140) {
      req.flash('error_messages', '回覆不可超過 140 個字')
      return res.redirect('back')
    }
    if (!req.body.comment) {
      req.flash('error_messages', '回覆不可為空白')
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: req.body.comment
    }).then(() => {
      res.redirect('back')
    })
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        like.destroy().then(() => {
          return res.redirect('back')
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = tweetController
