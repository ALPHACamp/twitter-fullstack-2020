const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const maxTweetLength = 140

const tweetController = {
  getTweets: (req, res) => {
    const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    Tweet.findAll({
      include: [
        User, 
        { model: Like, include: [User], }, 
        { model: Reply, include: [User], },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    }).then(async (tweets) => {
      // console.log(tweets[0])
      //計算 該則 tweet 被其他使用者喜歡或 有留言的次數
      //決定 tweets.handlebar 上的 留言跟喜歡按鈕是要實心或空心
      tweets = tweets.map((tweet) => ({
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes ? tweet.dataValues.Likes.length : 0,
        repliesCount: tweet.dataValues.Replies ? tweet.dataValues.Replies.length : 0,
        isLiked: tweet.dataValues.Likes.map((d) => d.dataValues.UserId).includes(userId),
        isReplied: tweet.dataValues.Replies.map((d) => d.dataValues.UserId).includes(userId),
      }))
      // 取得右邊欄位的Top users
      const topUsers = await helpers.getTopuser(helpers.getUser(req))
      return res.render('tweets', {
        tweets: tweets,
        users: topUsers,
        page: 'tweets',
      })
    })
  },

  // getTweets: (req, res) => {
  //   const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
  //   // console.log(req)
  //   Tweet.findAll({
  //     order: [['createdAt', 'DESC']],
  //     include: [User, Like],
  //     limit: 50,
  //   }).then(async (tweets) => {
  //     const whereQuery = {}
  //     // 把tweets 拆開用Promise.all 對各個tweet 取 TweetId
  //     // 再去Reply 把有TweetId 的replies全部抓出
  //     const tweetsUpdated = 
  //     await Promise.all( tweets.map( async (tweet) => {
  //       tweetId = tweet.dataValues.id
  //       whereQuery.TweetId = tweetId
  //       const reply = await Reply.findAndCountAll({where: whereQuery,})
  //       // console.log(reply)
  //       let tweetUpdate = {
  //         ...tweet.dataValues,
  //         repliesCount: reply.count ? reply.count : 0,
  //         likesCount: tweet.dataValues.Likes ? tweet.dataValues.Likes.length : 0,
  //         isLiked: tweet.dataValues.Likes.map((d) => d.dataValues.UserId).includes(userId),
  //         isReplied: reply.rows.map((d) => d.dataValues.UserId).includes(userId),
  //       }
  //       return tweetUpdate
  //     }))
  //     // console.log(tweetsUpdated)
  //     // 取得右邊欄位的Top users
  //     const topUsers = await helpers.getTopuser(helpers.getUser(req))
  //     // res.send('User1 的 Tweet1 User1 的 Tweet2')
  //     return res.render('tweets', {
  //       tweets: tweetsUpdated,
  //       users: topUsers,
  //     })
  //   })
  //     // console.log(tweets)
  // },
  postTweet: (req, res) => {
    // console.log('***req.body.description.length***',req.body.description.length)
    const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    if (req.body.description.length > maxTweetLength || req.body.description.length === 0){
      return res.redirect('back')
    }
    return Tweet.create({
      description: req.body.description,
      UserId: userId,
    }).then((tweet) => {
      // console.log(tweet)
      return res.redirect('/tweets')
    })
  },

  //***************原始寫法***************/
  getTweet: (req, res) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    // console.log('****tweetId******', tweetId)

    Tweet.findByPk(tweetId, {
      include: [
        { model: Like, include: [User] },  
        { model: Reply, include: [User], order: [['createdAt', 'DESC']] }, 
        User
      ],
    }).then(async (tweet) => {
      // console.log(req.user)
      // console.log(tweet.dataValues.Likes)
      tweet = {
        ...tweet.dataValues,
        likesCount: tweet.dataValues.Likes ? tweet.dataValues.Likes.length : 0,
        repliesCount: tweet.dataValues.Replies ? tweet.dataValues.Replies.length : 0,

        // 目前登入者是否留過言或喜歡, 如果有就把留言或喜歡符號實心
        isLiked: tweet.dataValues.Likes.map((d) => d.dataValues.UserId).includes(userId),
        isReplied: tweet.dataValues.Replies.map((d) => d.dataValues.UserId).includes(userId),
      }
      // 取得右邊欄位的Top users
      const topUsers = await helpers.getTopuser(helpers.getUser(req))
      return res.render('tweet', {
        tweet: tweet,
        users: topUsers,
      })
    })
  },

  
  // getTweet: (req, res) => {
  //   const tweetId = req.params.id
  //   const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
  //   const whereQuery = {}
  //   whereQuery.TweetId = tweetId
  //   return Promise.all([
  //     Tweet.findByPk(tweetId, {
  //       include: [
  //         { model: User, as: 'LikedUsers' }, 
  //         User
  //       ],
  //     }),
  //     Reply.findAndCountAll({
  //       where: whereQuery,
  //       order: [['createdAt', 'DESC']],
  //       include: [User],
  //     }),
  //   ]).then(async ([tweet, replies]) => {
  //     // console.log('****tweet****', tweet)
  //     // console.log('****replies****', replies)
  //     const repliesCount = replies.count ? replies.count : 0
  //     replies = replies.rows
  //     tweet = {
  //       ...tweet.dataValues,
  //       likesCount: tweet.dataValues.LikedUsers ? tweet.dataValues.LikedUsers.length : 0,
  //       repliesCount: repliesCount,
  //       isLiked: tweet.dataValues.LikedUsers.map((d) => d.dataValues.id).includes(userId),
  //       isReplied: replies.map((d) => d.dataValues.UserId).includes(userId),
  //       Replies: replies
  //     }
  //     // 取得右邊欄位的Top users
  //     const topUsers = await helpers.getTopuser(req.user)
      
  //     return res.render('tweet', {
  //       tweet: tweet,
  //       users: topUsers,
  //     })
  //   })
  // },
  postTweetReply: (req, res) => {
    const userId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    // console.log(req.body.user_reply)
    return Reply.create({
      comment: req.body.user_reply,
      TweetId: req.body.TweetId,
      UserId: userId,
    }).then((reply) => {
      // console.log(reply)
      res.redirect(`/tweets/${req.body.TweetId}/replies`)
    })
    // res.send(`/tweet/${req.params.id}/replies`)
  },
  deleteTweetReply: (req, res) => {
    return Reply.findByPk(req.params.id).then((reply) => {
      Reply.destroy().then((reply) => {
        res.redirect(`/tweets`)
      })
    })
  },
}

module.exports = tweetController
