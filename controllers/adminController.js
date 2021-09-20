const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship

const maxDescLen = 50

const adminController = {
  // 載入登入頁
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  // 登入跳轉
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  // 列出所有tweets，需處理tweets內容，超出maxDescLen字數則擷取maxDescLen字數並於後方加上"..."
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC'], // Sorts by createdAt in descending order
      ],
    })

    tweets.map(tweet => {
      tweet.description = tweet.description.length <= maxDescLen ? tweet.description : tweet.description.substring(0, maxDescLen) + "..."
    })

    return res.render('admin/tweets', { tweets })
  },

  // 刪除單一tweet
  deleteTweet: async (req, res) => {
    const TweetID = req.params.id

    // await Like.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(likes => {
    //   console.log("===============")
    //   console.log("likes before:", likes)
    // })

    // await Reply.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(replies => {
    //   console.log("===============")
    //   console.log("reply before:", replies)
    // })

    // await Tweet.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { id: TweetID }
    // }).then(tweets => {
    //   console.log("===============")
    //   console.log("tweet before:", tweets)
    // })

    await Like.destroy({ where: { TweetID } })
    await Reply.destroy({ where: { TweetID } })
    await Tweet.destroy({ where: { id: TweetID } })

    // await Like.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(likes => {
    //   console.log("===============")
    //   console.log("likes after:", likes)
    // })

    // await Reply.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { TweetID }
    // }).then(replies => {
    //   console.log("===============")
    //   console.log("reply after:", replies)
    // })

    // await Tweet.findAll({
    //   raw: true,
    //   nest: true,
    //   where: { id: TweetID }
    // }).then(tweets => {
    //   console.log("===============")
    //   console.log("tweet after:", tweets)
    // })

    res.redirect('/admin/tweets')
  },

  // 列出所有使用者
  getUsers: (req, res) => {
    Promise.all([
      User.findAll({
        include: [
          { model: User, as: 'Followers' },
          Tweet
        ],
        where: { isAdmin: false }
      }),
      Tweet.findAll({
        raw: true,
        nest: true,
        include: [Like]
      })
    ]).then(([users, tweets]) => {

      const usersData =
        users.map(user => ({
          ...user.dataValues,
          tweetCount: user.Tweets.length,
          // tweetCount: tweets.filter(tweet => tweet.UserId === user.dataValues.id).length,
          likeCount: tweets.filter(tweet => tweet.UserId === user.dataValues.id).reduce((accumulator, currentValue) => {
            // console.log("===================")
            // console.log("tweetid:", currentValue.id)
            // console.log("accumulator:", accumulator)
            // console.log("currentlikes:", currentValue.Likes)
            let addCount = currentValue.Likes.UserId ? 1 : 0
            // console.log("currentValue:", addCount)
            // console.log("return:", accumulator + addCount)
            return accumulator + addCount
          }, 0)
          // likeCount: user.Tweets.reduce((accumulator, currentValue) => {
          //   console.log("===================")
          //   console.log("tweetid:", currentValue.dataValues.id)
          //   console.log("accumulator:", accumulator)
          //   console.log("currentlikes:", currentValue.dataValues.Likes)
          //   console.log("currentValue:", currentValue.dataValues.Likes.length)
          //   console.log("return:", accumulator + currentValue.dataValues.Likes.length)
          //   return accumulator + currentValue.dataValues.Likes.length
          // }, 0)
        }))
      console.log(usersData)
      res.render('admin/users', { users: usersData })
    })
  }
}


module.exports = adminController