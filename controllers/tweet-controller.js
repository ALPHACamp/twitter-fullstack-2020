const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    Promise.all([
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
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      })
    ])
      .then(([tweets, users]) => {
        // 撈出loginUser，nav-left 使用
        const user = helpers.getUser(req) ? JSON.parse(JSON.stringify(helpers.getUser(req))) : []

        // 整理 tweets
        const likedTweetsId = helpers.getUser(req)?.LikeTweets ? helpers.getUser(req).LikeTweets.map(lt => lt.id) : [] // 先確認 req.user 是否存在，若存在檢查 LikeTweets 是否存在。如果 LikeTweets 存在則執行 map 撈出 tweet id 。若上述兩個不存在，回傳空陣列
        tweets = JSON.parse(JSON.stringify(tweets))
        for (const tweet of tweets) { // 以迴圈跑每一筆 tweet ，每一筆新增 numberOfReply 、 numberOfLike 、 isLiked 資訊
          tweet.numberOfReply = tweet.Replies.length
          tweet.numberOfLike = tweet.Likes.length
          tweet.isLiked = likedTweetsId.includes(tweet.id)
        }

        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users

        res.render('index', {
          user,
          tweets,
          users
        })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = Number(helpers.getUser(req).id)
    const { description } = req.body
    if (!description) throw new Error("Description didn't exist!")
    if (description.length > 140) throw new Error('Description too long!')

    return Tweet.create({ UserId: userId, description })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  }
}
module.exports = tweetController
