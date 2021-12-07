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

  // getTweets: (req, res) => {
  //   Tweet.findAll({
  //     //raw: true,
  //     //nest: true,
  //     include: [
  //       User
  //     ]
  //   }).then(tweets => {
  //     const data = tweets.map(r => ({
  //       ...r.dataValues,
  //       description: r.dataValues.description,
  //       userName: r.dataValues.User.name,
  //       accountName: r.dataValues.User.account,
  //       avatarImg: r.dataValues.User.avatar,
  //     }))
  //     console.log(data[0])
  //     return res.render('Tweets', {
  //       tweets: data,
  //     })
  //   })
  // },

  // test: 一般使用者首頁
  getTweets: (req, res) => {
    // 渲染首頁右邊人氣user畫面
    return User.findAll({
      include: [
        {model: User, as: 'Followers'}
      ]
    })
      .then( users => {
        users = users.map( user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(f => f.id).includes(user.id)
        }))
        // console.log(users[2])
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('tweets', { users })
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
        tweet: tweet.toJSON()
      })
    })
  }
}

module.exports = tweetController