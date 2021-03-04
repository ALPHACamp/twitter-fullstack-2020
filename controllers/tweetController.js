const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const pageLimit = 7 
const tweetController = {
  // getTweet: async (req, res) => {
  //   //tweet data
  //   let tweets = await Tweet.findAll({
  //     order: [['createdAt', 'DESC']],
  //     include: [User, Like, Reply]
  //   })
  //   tweets = tweets.map(t => ({
  //     ...t.dataValues,
  //     userName: t.User.name,
  //     userId: t.User.id,
  //     userAvatar: t.User.avatar,
  //     userAccount: t.User.account,
  //     LikedCount: t.Likes.length,
  //     ReplyCount: t.Replies.length,
  //     isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(t.id) : false
  //   }))

  //   //user data
  //   let users = await helpers.getTopUser(req)

  //   return res.render('tweets', { users, tweets })
  // },
  // 分頁
  getTweet: async (req, res) => {
    //-----------------------------page
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    //tweet data
    let tweets = await Tweet.findAll({
      offset, limit: pageLimit,
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply]
    })    

    //-----------------------------page
    let pageCount = await Tweet.findAndCountAll({}) 
    const page = Number(req.query.page) || 1 
    const pages = Math.ceil(pageCount.count / pageLimit)    
    const totalPage = Array.from({ length: pages }).map((_, index) => index + 1) 
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1
    //-----------------------------page
    
    tweets = tweets.map(t => ({
      ...t.dataValues,
      userName: t.User.name,
      userId: t.User.id,
      userAvatar: t.User.avatar,
      userAccount: t.User.account,
      LikedCount: t.Likes.length,
      ReplyCount: t.Replies.length,
      isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(t.id) : false
    }))    

    //user data
    let users = await helpers.getTopUser(req)

    return res.render('tweets', { users, tweets, page, totalPage, prev, next })
  },  

  postTweet: async (req, res) => {
    const { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '請輸入些甚麼')
      return res.redirect('/tweets')
    }
    if (description.length > 140) {
      req.flash('error_messages', '超過140字。')
      return res.redirect('/tweets')
    }
    await Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    })
    return res.redirect('/tweets')
  },

  getReply: async (req, res) => {    
    let tweet = await Tweet.findByPk(req.params.id, {      
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        User,
        Like,
        { model: Reply, include: [User] },
      ]
    })
    
    tweet = tweet.toJSON()
    const isLiked = tweet.Likes ? tweet.Likes.some(d => d.UserId === helpers.getUser(req).id) : false

    //////////////////////////////user data
    let users = await helpers.getTopUser(req)
    /////////////////////////////////////////////////     

    return res.render('reply', {
      tweet,
      ReplyCount: tweet.Replies.length,
      LikedCount: tweet.Likes.length,
      isLiked,
      users
    })
  },

  postReply: async (req, res) => {
    const tweetId = Number(req.params.id)
    const { comment } = req.body

    if (!comment.trim()) {
      req.flash('error_messages', '請輸入些甚麼')
      return res.redirect('back')
    }
    if (comment.length > 140) {
      req.flash('error_messages', '超過140字。')
      return res.redirect('back')
    }
    await Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: tweetId,
      comment
    })
    return res.redirect('back')
  },

  addLike: async (req, res) => {
    await Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    const awaitRemove = await Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
    await awaitRemove.destroy()
    return res.redirect('back')
  }
}
module.exports = tweetController