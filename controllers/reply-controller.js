const { User, Reply, Tweet, Like } = require('../models')
const helpers = require('../_helpers')
const handlebars = require('handlebars')
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'))

const replyController = {
  getReply: (req, res, next) => {
    Promise.all([
      Tweet.findByPk(req.params.tid, {
        order: [
          [Reply, 'createdAt', 'desc']
        ],
        include: [
          { model: Reply, include: User },
          { model: User },
          { model: Like }
        ]
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
      .then(([tweet, users]) => {
        if (!tweet) throw new Error("tweet didn't exist!")
        tweet = JSON.parse(JSON.stringify(tweet))
        const likesNum = tweet.Likes.length
        const userInfo = tweet.User
        const currentUser = helpers.getUser(req)
        const likedTweetsId = helpers.getUser(req)?.LikeTweets ? helpers.getUser(req).LikeTweets.map(lt => lt.id) : []
        userInfo.isLiked = likedTweetsId.includes(tweet.id) ? tweet.isLiked = likedTweetsId.includes(tweet.id) : false

        // 整理 users 只留被追蹤數排行前 10 者，nav-right 使用
        const followedUserId = helpers.getUser(req)?.Followings ? helpers.getUser(req).Followings.map(fu => fu.id) : [] // 先確認 req.user 是否存在，若存在檢查 Followings (該user追蹤的人) 是否存在。如果 Followers 存在則執行 map 撈出 user id 。若上述兩個不存在，回傳空陣列
        users = JSON.parse(JSON.stringify(users))
        for (const user of users) { // 以迴圈跑每一筆 user ，每一筆新增 numberOfFollowers、isFollowed 資訊
          user.numberOfFollowers = user.Followers.length
          user.isFollowed = followedUserId.includes(user.id)
        }
        users = users.sort((a, b) => b.numberOfFollowers - a.numberOfFollowers).slice(0, 10) // 只取排行前 10 的 users
        res.render('reply', { users, tweet, userInfo, likesNum, currentUser })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const tweetId = Number(req.params.tid)
    const userId = Number(helpers.getUser(req).id)
    const comment = req.body.comment
    if (!comment) throw new Error('需要輸入文字.')
    if (comment.length > 140) throw new Error('輸入文字過長!')
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('這則推文不存在!')
        return Reply.create({
          comment,
          TweetId: tweetId,
          UserId: userId
        })
      })
      .then(() => {
        req.flash('success_messages', '成功新增回覆')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
