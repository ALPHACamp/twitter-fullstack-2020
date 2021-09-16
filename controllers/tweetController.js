const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Followship = db.Followship

const helper = require('../_helpers');

const tweetController = {
  // 首頁
  getTweets: async (req, res) => {
    const id = req.params.id
    console.log('------------------分隔線1------------------')
    console.log(id)
    console.log(helper.getUser(req),'該使用者的資料 = req.user')
    const loginUserId = helper.getUser(req).id
    console.log('------------------分隔線2------------------')
    console.log(loginUserId) // root: 1
    console.log(req.query) // {} 空的
    console.log('------------------分隔線3------------------')
    
    // 如果推文的人在使用者的追隨名單內，就顯示推文
    // followship內 A使用者在 B使用者 的
    // 驗證使用者
    const whereQuery = {}
    whereQuery.userId = loginUserId
    
    console.log(whereQuery.userId)
    console.log('------------------分隔線4------------------')
    
    // 類似餐廳清單Favorite的邏輯，需要找到所有追隨中的使用者
    await Tweet.findAndCountAll({
      raw: true,
      nest: true,
      include: [User],
      where: whereQuery
    }).then(tweets => {
      console.log(tweets)
      console.log('---------觀察rows---------')
      console.log(tweets.rows)
      console.log('---------觀察---------')
      const data = tweets.rows.map(tweet => ({
        ...tweet.dataValues,
        // TweetCommentedCount: tweet.dataValues.CommentedTweets.length,
        // isCommented: req.user.CommentedTweets.map(d => d.id).includes(r.id), // 被回覆過的推文
        //推文被喜歡的次數
        TweetLikedCount: tweet.dataValues.LikedTweets.length,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(tweet.id) // 推文是否被喜歡過
      }))
        .then(() => {
          console.log(data)
          console.log('---------觀察data---------')
          return res.render('home', {
            tweets: data
          })
        })
    })
    // const tweets = await Tweet.findAll({  
    //   raw: true,
    //   nest: true,
    //   include: [User]
    // })
    // // console.log(tweets)
    // console.log('有到這嗎')
    // return res.render('home',{ tweets})
  },
  getTweet: async (req, res) => {
    // return Tweet.findByPk(req.params.id, {
    //   include: [
    //     ,
    //     // { model: User, as: 'Followers' },
    //     // { model: User, as: 'LikedUsers' },
    //     // { model: Reply, include: [User] }
    //   ]
    // })
    //   // .then(tweet => tweet.increment('viewCounts'))
    //   .then(tweet => {
    //     // const isFollowed = tweet.Followers.map(d => d.id).includes(req.user.id)
    //     // const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
    //     return res.render('tweet', {
    //       tweet: tweet.toJSON(),
    //       // isFollowed,
    //       // isLiked
    //     })
    //   })
    // console.log(req.params.id)
    try{
      const tweet = await Tweet.findByPk(
        req.params.id,{
        include: [User]  
      })
      return res.render('tweet',{tweet: tweet.toJSON()})
    }catch(e){
        console.log(e.message)
    }
  },
  // 在此得列出最受歡迎的十個使用者
  // 依照追蹤者人數降冪排序
  // 目前先另外寫一個controller，之後需要合併至getTweets
  getTopUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowedCount: user.FollowedUsers.length,
        isFollowed: req.user.FollowedUsers.map(d => d.id).includes(user.id)
      }))

      users = users
        .sort((a, b) => b.FollowedCount - a.FollowedCount)
        .slice(0, 10)
      return res.render('topUsers', { users })
    })
  },
}

module.exports = tweetController