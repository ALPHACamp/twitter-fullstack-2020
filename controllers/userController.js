const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const { raw } = require('body-parser')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
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
        include: [User, Reply, { model: User, as: 'LikedUsers' }],
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
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id), // 推文是否被喜歡過
      }))

      const topUsers =
        users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
      // console.log('我是data',data)
      return res.render('userSelf', { tweets: data, tweetUser: tweetUser.toJSON(), followersCount, followingsCount, topUsers, theUser: helpers.getUser(req).id })
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

  getUserSelfLike: async (req, res) => {

    const likes = await Like.findAll({
      where: { UserId: req.params.id },
      include: [User, { model: Tweet, include: [User, Reply, { model: User, as: 'LikedUsers' }] }],
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
    const data = likes.map(like => ({
      id: like.Tweet.id,
      avatar: like.Tweet.User.avatar,
      name: like.Tweet.User.name,
      account: like.Tweet.User.account,
      createdAt: like.Tweet.createdAt,
      description: like.Tweet.description,
      RepliesLength: like.Tweet.Replies.length,
      LikedUsersLength: like.Tweet.LikedUsers.length,
      isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(like.TweetId)
    }))
    // const isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(tweet.id) 
    console.log(data)
    return res.render('userSelfLike', { data, tweets, tweetUser })
    // const tweets = await Tweet.findAll({
    //   where: {UserId: req.params.id},
    //   include: [User, Reply],
    //   order: [['createdAt', 'DESC']]
    // })
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

  putUserProfile: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    console.log(user)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!")

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        user.update({
          name: req.body.name,
          avatar: file ? img.data.link : user.avatar,
          cover: file ? img.data.link : user.cover,
          description: req.body.description
        })
      }).then((user) => {
        req.flash('success_messages', 'Your profile was successfully to update')
        res.redirect('back')
      })
    }
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
    console.log('req.params',req.params)
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.increment('likeCount', { by: 1 })
        Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId
        })
      }).then(() => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.decrement('likeCount', { by: 1 })
        Like.destroy({
          where: {
            UserId: helpers.getUser(req).id,
            TweetId: req.params.tweetId
          }
        })
      }).then(() => {
        return res.redirect('back')
      })
  },

  // Followship
  addFollowing: (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id

    // 確認不能追蹤自己
    if (Number(followerId) === Number(followingId)) {
      req.flash('error_messages', 'You can\'t follow yourself!')
      return res.redirect('/tweets')
    }

    // 確認該筆追蹤尚未存在於followship中，若不存在才創建新紀錄
    Followship.findAll({
      where: {
        followerId, followingId
      }
    }).then(followship => {
      if (followship.length) {
        req.flash('error_messages', 'You already followed this user')
        return res.redirect('/tweets')
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
        followerId: helpers.getUser(req).id,
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
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
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
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
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
