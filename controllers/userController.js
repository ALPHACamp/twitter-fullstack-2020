// TODO controller
const bcrypt = require('bcryptjs')
const { raw } = require('body-parser')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('error_messages', '所有欄位都是必填');
      return res.redirect('/signup')
    }
    if (password !== checkPassword) {
      // req.flash('error_messages', '兩次密碼輸入不同！')
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect('/signup')
    }
    // confirm unique user
    User.findOne({ where: [{ email }, { account }] }).then(user => {
      if (user) {
        if (user.email === email) {
          req.flash('error_messages', '信箱重複！')
        }
        if (user.account === account) {
          req.flash('error_messages', '信箱重複！')
        }
        return res.redirect('/signup')
      } else {
        User.create({
          account: account,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/signin')
        })
      }
    })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },


  getUserTweets: async (req, res) => {
    // const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [User, Reply],
        order: [['createdAt', 'DESC']]
      }),
      Followship.count({
        where: { followingId: req.params.id }
      }),
      Followship.count({
        where: { followerId: req.params.id }
      }),
      User.findByPk(
        req.params.id
      ),
      User.findAll({
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" }
      }),
    ]).then(([tweets, followersCount, followingsCount, tweetUser, users]) => {
      const topUsers =
        users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
      return res.render('userSelf', { tweets, tweetUser: tweetUser.toJSON(), followersCount, followingsCount, topUsers, theUser: helpers.getUser(req).id })
    })
  },

  getUserSelfReply: async (req, res) => {

    const replies = await Reply.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.params.id },
      include: [User, { model: Tweet, include: [User] }],
      order: [['createdAt', 'DESC']]
    })
    const tweets = await Tweet.findAll({
      where: { UserId: req.params.id },
      include: [User, Reply],
      order: [['createdAt', 'DESC']]
    })
    const tweetUser = await User.findByPk(
      req.params.id
    )
    return res.render('userSelfReply', { replies, tweets, tweetUser })
  },

  getSetting: (req, res) => {
    return res.render('setting')
  },
  putUser: async (req, res) => {
    const user = await User.findByPk(req.params.id)

    user.update({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    })
    req.flash('success_messages', 'user was successfully to update')
    res.redirect('/tweets')
  },

  // getUserTweets: (req, res) => {
  //   const id = req.params.id
  //   const loginUserId = helpers.getUser(req).id
  //   const whereQuery = {}

  //   // 類似餐廳與類別的關係
  //   // 多個餐廳屬於一種類別: 多個推文屬於一個使用者
  //   if (req.query.tweetId) {
  //     tweetId = Number(req.query.userId)
  //     whereQuery.userId = tweetId
  //   }

  //   // 顯示個人資料及推文
  //   Tweet.findAndCountAll({
  //     raw: true,
  //     nest: true,
  //     where: { UserId: id }
  //   })
  //     .then((result) => {
  //       const data = result.rows.map(r => ({
  //         ...r.dataValues
  //       }))
  //       User.findByPk(id)
  //         .then((user) => {
  //           const userProfile = user.toJSON()
  //           return res.render('user', {
  //             data,
  //             tweets: data,
  //             userProfile,
  //             loginUserId,
  //             replyNum,
  //           })
  //         }).catch(err => console.log(err))
  //     }).catch(err => console.log(err))
  // },

  // // 尋找回覆過且正在追隨的使用者推文
  // // 不需要認證使用者
  // getReplyTweets: (req, res) => {
  //   const id = req.params.id
  //   const whereQuery = {}

  //   if (req.query.tweetId) {
  //     tweetId = Number(req.query.userId)
  //     whereQuery.userId = tweetId
  //   }

  //   // 顯示回覆過的推文
  //   Reply.findAll({
  //     include: tweet,
  //     where: { UserId: id }
  //   })
  //     .then((result) => {
  //       // 回覆過的推文數量
  //       const replyNum = result.count
  //       const replyTweets = result.rows
  //       const data = replyTweets.map(r => ({
  //         ...r.dataValues
  //       }))

  //       tweet.findAll({
  //         raw: true,
  //         nest: true,
  //         where: whereQuery
  //       }).then(() => {
  //         User.findByPk(id)
  //           .then((user) => {
  //             const userProfile = user.toJSON()
  //             return res.render('user', {
  //               data,
  //               tweets: data,
  //               userProfile,
  //               loginUserId,
  //               replyNum,
  //             })
  //           }).catch(err => console.log(err))
  //       })

  //       // TODO 2.顯示喜歡的內容

  //     })
  //     .catch(err => console.log(err))
  // },

  // Like
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
      .then((Like) => {
        Like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },

  // Followship
  addFollowing: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId

    // 確認不能追蹤自己
    if (followerId === followingId) {
      req.flash('error_messages', 'You can\'t follow yourself!')
      res.render('/tweets')
    }

    // 確認該筆追蹤尚未存在於followship中，若不存在才創建新紀錄
    Followship.findAll({
      where: {
        followerId, followingId
      }
    }).then(followship => {
      if (followship.length) {
        req.flash('error_messages', 'You already followed this user')
        return res.render('/tweets')
      } else {
        Followship.create({
          followerId,
          followingId
        })
        return res.redirect('back')
      }
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },

  getFollowers: (req, res) => {
    return Promise.all([
      Followship.findAll({
        where: { followingId: req.params.id },
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
        nest: true,
        raw: true
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" },
      })
    ]).then(([followers, usersdata]) => {
      const users = usersdata.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
      }))

      const data = followers.map(d => ({
        ...users.find(element => Number(element.id) === Number(d.followerId))
      }))

      const topUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
      res.render('userSelfFollowship', { data, topUsers, theUser: helpers.getUser(req).id, renderType: "follower" })
    })
  },

  getFollowings: (req, res) => {
    return Promise.all([
      Followship.findAll({
        where: { followerId: req.params.id },
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
        nest: true,
        raw: true
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" },
      })
    ]).then(([followings, usersdata]) => {
      const users = usersdata.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
      }))

      const data = followings.map(d => ({
        ...users.find(element => Number(element.id) === Number(d.followingId))
      }))

      const topUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
      res.render('userSelfFollowship', { data, topUsers, theUser: helpers.getUser(req).id, renderType: "following" })
    })
  }
}

module.exports = userController
