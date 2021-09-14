const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Followship = db.Followship

const tweetController = {
  // 首頁
  getTweets: (req, res) => {
    const id = req.params.id
    const loginUserId = helper.getUser(req).id
    const whereQuery = {}
    // 如果推文的人在使用者的追隨名單內，就顯示推文
    // 驗證使用者
    if (req.query.userId) {
      userId = Number(req.query.userId)
      whereQuery.userId = userId
    }
    // 找出所有在追隨者名單中的追隨者推文
    Tweet.findAll({
      include: Followship,
      where: { FollowingId: id }
    }).then(result => {
      // 如果是在個人資料，要顯示使用者推文數量
      // 在此顯示 使用者自身推文、追隨者的貼文、回覆和喜歡的內容
      // 依時間降冪排序
      const followingUsersTweets = result.rows
      const data = followingUsersTweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        likedCount: r.dataValues.likedCount,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id), // 判斷是否對推文按讚過，有的話要更改圖示
        repliedCount: r.dataValues.repliedCount,
        isReplied: req.user.RepliedTweets.map(d => d.id).includes(r.id), // 被回覆過的推文
      }))
        .then(() => {
          return res.render('tweets', {
            tweets: data,
            loginUserId // 判斷是否為使用者
          })
        })
    })
  },
  // 取得單一推文資料，要有 使用者頭像，暱稱、帳號 
  // 推文要有內容like, reply
  getTweet: (req, res) => {
    const id = req.params.id
    return Tweet.findByPk(id, {
      // TODO 需要包含的資料有哪些?
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    })
      .then(tweet => {
        const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
        return res.render('tweet', {
          tweet: tweet.toJSON(),
          isLiked
        })
      })
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