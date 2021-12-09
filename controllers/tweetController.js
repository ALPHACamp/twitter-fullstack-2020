const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {

  // 前台推文清單
  // 此頁面需要render的資料有
  // 所有tweets
  // 所有tweets的user的相關資料
  // 所有tweets的總like數 
  // 登入的user是否已like過特定tweet
  // 追蹤人數最多的user前10名單

  getTweets: (req, res) => {
    //return res.send('what the fuck')
    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [
        Reply,
        { model: User, include: [Like] },
        { model: Like, include: [Tweet] }
      ]
    })
      .then(tweets => {
        User.findAll({
          raw: true,
          nest: true,
          include: [
            { model: User, as: 'Followers' }
          ]
        })
          .then(users => {
            tweets = tweets.map(tweet => ({
              ...tweet,
              tweetsUserAvatar: tweet.User.avatar,
              tweetsUserName: tweet.User.name,
              tweetsUserAccount: tweet.User.account,
              tweetsCreatedAt: tweet.createdAt,
              tweetsId: tweet.id,
              tweetsContent: tweet.description,
              // user的貼文回覆總數量
              repliesTotal: tweet.Replies.length,
              // 判斷是否liked
              // if tweet.like.UserId 有 req.user.id = true
              isLiked: helpers.isMatch(tweet.Likes.UserId, helpers.getUser(req).id),
              //likeTotal: tweet.Likes.length
            }))
            users = users.map(user => ({
              ...user,
              topUserAvatar: user.avatar,
              topUserName: user.name,
              topUserAccount: user.account,
              FollowerCount: user.Followers.length,
              isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(user.id)
            }))
            console.log('*********')
            console.log('tweets:', tweets[0])
            console.log('*********')
            // console.log('tweet.Likes: ', tweets[0].Likes)
            console.log('users: ', users[0])
            console.log('*********')
            //console.log('users: ', users[0])
            users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
            return res.render('tweets', { tweets, users, user: helpers.getUser(req) })
          })
      })
  },

  //前台瀏覽個別推文
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      return res.render('tweet', {
        tweet: tweet.toJSON(),
        user: helpers.getUser(req)
      })
    })
  },
  //新增推文
  postTweet: (req, res) => {
    if (req.body.description.length > 140) {
      req.flash('error_messages', '字數不可超過140字')
      return res.redirect('back')
    }
    if (req.body.description.length < 1) {
      req.flash('error_messages', '內容不可為空白')
      return res.redirect('back')
    }
    Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    }).then(tweets => {
      return res.redirect('/tweets')
    })
  }
}

module.exports = tweetController