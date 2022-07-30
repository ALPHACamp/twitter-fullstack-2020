const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
          { model: Like, attributes: ['id'] },
          { model: Reply, attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']],
        nest: true
      }),
      User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([tweets, users]) => {
        // 整理 tweets
        const likedTweetsId = helpers.getUser(req)?.LikeTweets ? helpers.getUser(req).LikeTweets.map(lt => lt.id) : [] // 先確認 req.user 是否存在，若存在檢查 LikeTweets 是否存在。如果 LikeTweets 存在則執行 map 撈出 tweet id 。若上述兩個不存在，回傳空陣列
        tweets = JSON.parse(JSON.stringify(tweets))
        for (const tweet of tweets) { // 以迴圈跑每一筆 tweet ，每一筆新增 numberOfReply 、 numberOfLike 、 isLiked 資訊
          tweet.numberOfReply = tweet.Replies.length
          tweet.numberOfLike = tweet.Likes.length
          tweet.isLiked = likedTweetsId.includes(tweet.id)
        }

        // 整理 users（要傳給 nav-right）
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        const filterSelfUser = []
        users = users.forEach(user => {
          if (user.id !== helpers.getUser(req).id && user.role !== 'admin') {
            filterSelfUser.push(user)
          }
        })
        users = filterSelfUser.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10) // 只取排行前 10 的 users

        const user = helpers.getUser(req)

        return res.render('index', {
          user: user.toJSON(),
          tweets,
          users
        })
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
