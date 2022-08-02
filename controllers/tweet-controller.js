const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id

    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      nest: true,
      include: [User, Reply, Like, { model: User, as: 'likedUsers' }]
    })
      .then(tweets => {
        const user = helpers.getUser(req)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50),
          User: t.User.dataValues,
          user,
          isLiked: t.likedUsers.some(item => item.id === userId)

        }))
        res.render('tweets', { tweets: data, user })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const description = req.body.description

    // todo: 錯誤訊息顯示在modal上面
    if (!req.body.description) throw new Error('error_messages', '內容不可空白')
    if (req.body.description.trim().length === 0) throw new Error('error_messages', '請輸入推文內容!')
    if (req.body.description.length > 140) throw new Error('error_messages', '推文超過140字數限制')

    User.findByPk(userId, {
      raw: true,
      nest: true
    })
    return Tweet.create({
      userId,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功發布推文')
        res.redirect('/tweets')
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    return Promise.all([Tweet.findByPk(tweetId, {
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [User, Reply, Like, { model: User, as: 'likedUsers' }]
    }),
    Reply.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: User,
      where: { tweet_id: tweetId }
    }),
    Like.findAll({
      raw: true,
      where: { tweet_id: tweetId }
    })
    ])
      .then(([tweet, replies, likes]) => {
        const data = replies.map(r => ({
          ...r
        }))
        const post = {
          tweet: tweet,
          isLiked: tweet.likedUsers.id === userId
        }
        console.log(post)
        res.render('tweet', { tweet: post, replies: data, likes })
      })
      .catch(err => next(err))
  },
  postReply: (req, res) => {
    // if (req.body.reply.length > 140) {
    //   return res.redirect('back')
    // }
    const userId = helpers.getUser(req).id
    const TweetId = req.params.id
    const comment = req.body.reply

    Reply.create({
      userId,
      TweetId,
      comment
    }).then(reply => {
      res.redirect(`/tweets/${TweetId}/replies`)
    })
  },
  likePost: (req, res) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    // const
    Like.create({
      userId,
      tweetId
    }).then(like => {
      res.redirect('back')
    })
  },
  unlikePost: (req, res) => {
    // const userId = helpers.getUser(req).id
    const TweetId = req.params.id

    Like.findOne({
      where: {
        UserId: helpers.getUser(req) && helpers.getUser(req).id,
        TweetId
      }
    }).then(like => {
      like.destroy()
        .then(() => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = tweetController
