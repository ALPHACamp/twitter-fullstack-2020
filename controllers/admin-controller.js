const { User, Tweet, Reply, Like } = require('../models')

const adminController = {
  SignInPage: (req, res) => {
    return res.render('admin/signin')
  },

  SignIn: (req, res) => {
    req.flash('success_messages', 'admin 成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', 'admin 登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  GetTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{
        model: User,
        attributes: ['avatar', 'name', 'account']
      }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    }) // FIXME: 在清單上快覽 Tweet 的前 50 個字
      .then(tweets => {
        res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => { // 刪除 Tweet 後，也去 Reply 和 Like 把相關資料刪除
        Promise.all([
          Reply.destroy({
            where: { TweetId: req.params.tweetId }
          }),
          Like.destroy({
            where: { TweetId: req.params.tweetId }
          })
        ])
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },

  getUsers: (req, res, next) => {
    User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'name', 'account', 'avatar', 'cover'], // 只拿 user的 cover, avatar, name, account
      include: [
        { model: User, as: 'Followings', attributes: ['id'] }, // 該 user 追蹤多少人
        { model: User, as: 'Followers', attributes: ['id'] }, // 該 user 被多少人追蹤
        {
          model: Tweet,
          include: [
            { model: User, attributes: ['id'] }, // 該 user 總共發了幾則推文
            { model: Like, attributes: ['id'] } // 該 user 的所有推文總共獲得多少個like
          ],
          attributes: ['id']
        }
      ],
      nest: true
    })
      .then(users => { // 整理資料
        const userList = [] // 最後要丟給 views 的 user

        for (const user of users) { // 以迴圈跑每一筆user，只撈需要的資料塞回去給 userList
          const singleUser = {}

          singleUser.account = user.account
          singleUser.name = user.name
          singleUser.avatar = user.avatar
          singleUser.cover = user.cover
          singleUser.numberOfTweets = user.Tweets.length
          singleUser.numberOfFollowings = user.Followings.length
          singleUser.numberOfFollowers = user.Followers.length

          let numberOfBeLike = 0
          for (const tweet of user.Tweets) {
            numberOfBeLike += tweet.Likes.length
          }
          singleUser.numberOfBeLike = numberOfBeLike

          userList.push(singleUser)
        }
        return userList
      })
      .then(userList => {
        userList.sort((a, b) => b.numberOfTweets - a.numberOfTweets) // 依照「user總共發了幾則推文」排序數量，由多至少
        res.render('admin/users', {
          users: userList
        })
      })
  }
}

module.exports = adminController
