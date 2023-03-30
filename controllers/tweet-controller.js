const { Tweet, User, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
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
  postTweet: (req, res, next) => {
    const tweetText = req.body.tweetText ? req.body.tweetText.trim() : req.body.description.trim()
    req.flash()
    if (!tweetText || tweetText.length > 140) {
      req.flash('errorFlashMessage', '推文不可空白或超過140字!')
      return res.redirect('back')
    }
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
  getReplies: (req, res, next) => {
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
              }]
          },
        ]
      })
      .then(tweet => {
        const isLiked = tweet.Likes.map((i) => i.UserId).includes(helpers.getUser(req).id)
        const reply = tweet.toJSON().Replies.map(i => {
          i.isLiked = i.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          i.followingByReply.map(j => {
            j.isLiked = j.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          })
          return i
        })
        res.render('replies', {
          isLiked,
          tweet: tweet.toJSON(),
          reply,
          LocaleDate: tweet.toJSON().updatedAt.toLocaleDateString(),
          LocaleTime: tweet.toJSON().updatedAt.toLocaleTimeString(),
        })
      })
  },
  postReply: (req, res, next) => {
    const tweetId = req.params.id
    //const replyText = req.body.comment
    const replyText = req.body.replyText ? req.body.replyText.trim() : req.body.comment.trim()
    console.log(replyText)
    if (!replyText.length || replyText.length > 140) {
      req.flash('errorFlashMessage', '回覆不可空白或超過140字!')
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
  addLike: async (req, res) => {
    try {
      const isCreated = await Like.findOrCreate(
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
      if (isCreated) console.log('addLike success')
      else console.log('addLike already created')
      return res.redirect('back')
    }
    catch {
      // console.log('addLike error')
      return res.redirect('back')
    }
  },
  removeLike: (req, res) => {
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
            //console.log('removeLike error')
            return res.redirect('back')
          })
      })
      .catch((err) => {
        //console.log('queryLike error')
        return res.redirect('back')
      })
  },
}
module.exports = tweetController