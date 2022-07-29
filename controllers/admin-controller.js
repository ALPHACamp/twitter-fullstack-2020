const { sequelize, Sequelize, User, Tweet, Like } = require('../models')
const { Op } = require('sequelize')

const adminController = {
  signinPage: (req, res, next) => {
    res.render('admin_signin')
  },

  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      raw: true,
      nest: true,
      order: [['created_at', 'DESC']]
    }).then(tweets => {
      const result = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50)
        }
      })
      // res.send(tweets)
      res.render('admin_tweets', { tweets: result })
    })
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
  },

  getUsers: (req, res, next) => {
    User.findAll({
      // where: { role: 'user' }, 用這個方法排除 admin 會使 test 不通過
      // where: { role: { [Op.not]: 'admin' } }, 正確排除資料，但測試一樣不過
      nest: true,
      include: [
        { model: Tweet, attributes: ['id'], include: { model: Like, attributes: ['id'] } },
        { model: User, attributes: ['id'], as: 'Followers', through: { attributes: ['id'] } },
        { model: User, attributes: ['id'], as: 'Followings', through: { attributes: ['id'] } }
      ],
      attributes: [
        'id',
        'name',
        'account',
        'cover',
        'avatar',
        'role',
        [
          sequelize.literal(`(
                SELECT COUNT(*)
                FROM Tweets AS t
                WHERE
                t.user_Id = User.id
            )`),
          'tweetsCount'
        ]
      ],
      order: [[sequelize.literal('tweetsCount'), 'DESC']]
    }).then(users => {
      const result = users
        .filter(user => user.role !== 'admin') // 過濾 admin 不能出現在 users 清單
        .map(user => {
          const userObj = user.toJSON()
          delete userObj.password
          return {
            ...userObj,
            // tweetsCount: user.Tweets.length, 計算推文數交給上面 sql 來做
            likesCount: user.Tweets.reduce((acc, cur) => acc + cur.Likes.length, 0),
            followersCount: user.Followers.length,
            followingsCount: user.Followings.length
          }
        })
      // .sort((a, b) => b.tweetsCount - a.tweetsCount) 排序交給 sql 來做
      // res.send(result)
      res.render('admin_users', { users: result })
    })
  }
}

module.exports = adminController
