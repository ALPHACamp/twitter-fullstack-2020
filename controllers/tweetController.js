const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Followship = db.Followship

const helpers = require('../_helpers')

const maxDescLen = 50

const tweetController = {
  // 首頁
  getTweets: async (req, res) => {
    // const id = req.params.id
    // console.log(helper.getUser(req),'哈哈')
    // const loginUserId = helper.getUser(req).id
    // const whereQuery = {}
    // // 如果推文的人在使用者的追隨名單內，就顯示推文
    // // followship內 A使用者在 B使用者 的
    // // 驗證使用者
    // if (req.query.userId === loginUserId) {
    //   userId = Number(req.query.userId)
    //   whereQuery.userId = userId
    // }

    // Tweet.findAndCountAll({
    //   // include: Followship,
    //   where: whereQuery
    // }).then(result => {
    //   const data = result.rows.map(r => ({
    //     ...r.dataValues,
    //     isCommented: helpers.getUser(req).CommentedTweets.map(d => d.id).includes(r.id), // 被回覆過的推文
    //     isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.id) // 被喜歡過的推文
    //   }))
    //     .findAll({
    //       raw: true,
    //       nest: true
    //     }).then(() => {
    //       return res.render('tweets', {
    //         tweets: data,
    //       })
    //     })
    // })
    const tweets = await Tweet.findAll({
      // raw: true,  //nest、raw先註解，tweets.handlexbars才能收到Reply的數量
      // nest: true,
      include: [
          User,
          Reply
      ],
      order: [
        ['createdAt', 'DESC'], // Sorts by createdAt in descending order
      ],
    })
    // const tweets = data.map(d => ({
    //   ...d.dataValues,
    //   // isLiked: d.LikedUsers.map(i => i.id).includes(helpers.getUser(req).id)
    // }))

    if (helpers.getUser(req).isAdmin) {
      tweets.map(tweet => {
        tweet.description = tweet.description.length <= 50 ? tweet.description : tweet.description.substring(0, maxDescLen) + "..."
      })
    }
    const renderPage = helpers.getUser(req).isAdmin ? 'admin/admin_main' : 'tweets'
    return res.render(renderPage, { tweets })

  },
  postTweet: async (req, res) =>{
    let { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不能空白！')
      return res.redirect('back')
    }
     if (description.length > 140) {
      req.flash('error_messages', '推文不能為超過140字！')
      return res.redirect('back')
    }
    await Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    res.redirect('/tweets')
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
    try {
      const tweet = await Tweet.findByPk(
        req.params.id, {
        include: [
          User,
          {model:Reply, include: [User]}
        ],
        order: [['Replies', 'createdAt', 'DESC']]
      })
      console.log('tweet:',tweet)
      return res.render('tweet', { tweet: tweet.toJSON() })
    } catch (e) {
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
        isFollowed: helpers.getUser(req).FollowedUsers.map(d => d.id).includes(user.id)
      }))

      users = users
        .sort((a, b) => b.FollowedCount - a.FollowedCount)
        .slice(0, 10)
      return res.render('topUsers', { users })
    })
  },
}

module.exports = tweetController
