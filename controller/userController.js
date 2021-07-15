const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const helpers = require('../_helpers')
const apiController = require('./apiController')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  //註冊
  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(userEmail => {
          if (userEmail) {
            req.flash('error_messages', '此信箱已被註冊！')
            return res.redirect('/signup')
          } else {
            User.findOne({ where: { account: req.body.account } })
              .then(userAccount => {
                if (userAccount) {
                  req.flash('error_messages', '此帳號已被使用！')
                  return res.redirect('/signup')
                } else {
                  User.create({
                    name: req.body.name,
                    account: req.body.account,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                  }).then(user => {
                    req.flash('success_messages', '成功註冊帳號！')
                    return res.redirect('/signin')
                  })
                }
              })
          }
        })
    }
  },

  //登入頁面
  signInPage: (req, res) => {
    if (res.locals.user) {
      delete res.locals.user
    }
    return res.render('signin')
  },

  //登入
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  //登出
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserReplies: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const userInfo = res.locals.userInfo
      const user = helpers.getUser(req)
      let myPage = true
      if (Number(req.params.userId) !== helpers.getUser(req).id) {
        myPage = false
      }

      const replies = await Reply.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          UserId: userInfo.user.id
        },
        include: [Tweet],
        order: [
          ['createdAt', 'DESC']
        ]
      })

      const allowEdit = Number(req.params.userId) !== helpers.getUser(req).id
      const isFollowed = userInfo.followers.map(f => f.followerId).includes(helpers.getUser(req).id)

      let Data = []
      Data = replies.rows.map(async (reply, index) => {
        if (reply.Tweet.UserId) {
          const [tweetUser, likes, replies] = await Promise.all([
            User.findOne({
              raw: true,
              nest: true,
              where: {
                id: Number(reply.Tweet.UserId)
              }
            }),
            Like.findAndCountAll({
              raw: true,
              nest: true,
              where: {
                TweetId: reply.TweetId
              }
            }),
            Reply.findAndCountAll({
              raw: true,
              nest: true,
              where: {
                TweetId: reply.TweetId
              }
            })
          ])
          return {
            id: reply.id,
            comment: reply.comment,
            TweetId: reply.TweetId,
            tweetDescription: reply.Tweet.description,
            tweetUserId: tweetUser.id,
            tweetUserName: tweetUser.name,
            tweetUserAvatar: tweetUser.avatar,
            tweetUserAccount: tweetUser.account,
            likeCount: likes.count,
            replyCount: replies.count
          }
        }
      })
      Promise.all(Data).then(data => {
        return res.render('replies', {
          thisUser: userInfo.user,
          user,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          data,
          topFollowing,
          replyCount: replies.count,
          allowEdit,
          isFollowed,
          myPage
        })
      })
    }
    catch (err) {
      console.log(err)
      return res.redirect('/')
    }
  },

  getUserTweets: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const userInfo = res.locals.userInfo
      const user = helpers.getUser(req)
      let myPage = true
      if (Number(req.params.userId) !== helpers.getUser(req).id) {
        myPage = false
      }

      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        //使用者發的所有推文
        where: { userId: userInfo.user.id },
        order: [
          ['createdAt', 'DESC']
        ]
      })

      const allowEdit = Number(req.params.userId) !== helpers.getUser(req).id
      const isFollowed = userInfo.followers.map(f => f.followerId).includes(helpers.getUser(req).id)

      let Data = []
      Data = tweets.rows.map(async (tweet, index) => {
        const [replyCount, likeCount] = await Promise.all([
          Reply.findAndCountAll({
            raw: true,
            nest: true,
            where: { TweetId: tweet.id },
          }),
          Like.findAndCountAll({
            raw: true,
            nest: true,
            where: { TweetId: tweet.id },
          }),
        ])
        return {
          ...tweet,
          replyCount: replyCount.count,
          likeCount: likeCount.count
        }
      })

      Promise.all(Data).then(data => {
        return res.render('tweets', {
          thisUser: userInfo.user,
          user,
          userInfo,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          data,
          tweetCount: tweets.count,
          topFollowing,
          isFollowed,
          allowEdit,
          myPage
        })
      })
    } catch (err) {
      console.log('-----------------')
      console.log(err)
      return res.redirect('/')
    }

  },


  getUserLikes: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const userInfo = res.locals.userInfo
      const user = helpers.getUser(req)
      let myPage = true
      if (Number(req.params.userId) !== helpers.getUser(req).id) {
        myPage = false
      }

      //所有的like清單裡面屬於userInfo.user.id的
      const likes = await Like.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          UserId: userInfo.user.id
        },
        //撈出userInfo.user.id關聯的推文
        include: [Tweet],
        order: [
          ['createdAt', 'DESC']
        ]
      })

      const allowEdit = Number(req.params.userId) !== helpers.getUser(req).id
      const isFollowed = userInfo.followers.map(f => f.followerId).includes(helpers.getUser(req).id)

      const likeCount = likes.count
      let Data = []
      //userInfo.user.id的like做資料陣列處理（已經撈到關聯推文）
      Data = likes.rows.map(async (like, index) => {
        //從資料庫裡面查找userInfo.user.id的like, 其user, tweet, reply關聯資料
        const [tweetUser, tweetLikes, replies] = await Promise.all([
          User.findOne({
            raw: true,
            nest: true,
            where: {
              //關聯推文資料的UserId
              id: like.Tweet.UserId
            }
          }),
          Like.findAndCountAll({
            raw: true,
            nest: true,
            where: {
              //Like資料有關聯TweetId，而與user.id有關的TweetId，可以用來對應Like資料庫裡，有多少相同的TweetId，表示有多少人喜歡的數字
              TweetId: like.TweetId
            }
          }),
          Reply.findAndCountAll({
            raw: true,
            nest: true,
            where: {
              TweetId: like.TweetId
            }
          })
        ])
        return {
          id: like.id,
          tweetUser: tweetUser,
          tweetLikesCount: tweetLikes.count,
          replyCount: replies.count,
          tweet: like.Tweet
        }
      })

      Promise.all(Data).then(data => {
        return res.render('likes', {
          thisUser: userInfo.user,
          userInfo,
          user,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          data,
          topFollowing,
          likeCount,
          allowEdit,
          isFollowed,
          myPage
        })
      })
    }
    catch (err) {
      console.log(err)
      console.log('------------------')
      return res.redirect('/')
    }
  },

  getUserFollowings: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const user = helpers.getUser(req)
      const userInfo = res.locals.userInfo
      const { userId } = req.params

      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          UserId: req.params.userId
        }
      })
      const tweetCount = tweets.count

      const following = await Followship.findAll({
        raw: true,
        nest: true,
        where: {
          followerId: userInfo.user.id
        },
        order: [
          ['createdAt', 'DESC']
        ]
      })

      let Data = []

      Data = following.map(async (f, i) => {
        const user = await User.findByPk(f.followingId)
        const isFollowed = await Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: f.followingId
          }
        })
        return {
          ...f,
          isFollowed: isFollowed ? true : false,
          user
        }
      })

      Promise.all(Data).then(data => {
        console.log(data)
        return res.render('followings', {
          thisUser: userInfo.user,
          user,
          data,
          tweetCount,
          topFollowing
        })
      })
    }
    catch (err) {
      console.log('----------------------')
      console.log(err)
      console.log('--------------------')
      return res.redirect('/')
    }
  },

  getUserFollowers: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const user = helpers.getUser(req)
      const userInfo = res.locals.userInfo
      const { userId } = req.params

      const tweets = await Tweet.findAndCountAll({
        raw: true,
        nest: true,
        where: {
          UserId: req.params.userId
        }
      })
      const tweetCount = tweets.count

      const follower = await Followship.findAll({
        raw: true,
        nest: true,
        where: {
          followingId: userInfo.user.id
        },
        order: [
          ['createdAt', 'DESC']
        ]
      })

      let Data = []

      Data = follower.map(async (f, i) => {
        const user = await User.findByPk(f.followerId)
        const isFollowed = await Followship.findOne({
          where: {
            followerId: helpers.getUser(req).id,
            followingId: f.followerId,
          }
        })
        return {
          ...f,
          isFollowed: isFollowed ? true : false,
          user
        }
      })

      Promise.all(Data).then(data => {
        console.log(data)
        return res.render('followers', {
          thisUser: userInfo.user,
          user,
          data,
          tweetCount,
          topFollowing
        })
      })
    }
    catch (err) {
      console.log(err)
      console.log('getUserFollowers err')
      return res.redirect('/')
    }
  },

  //進入帳號設定頁面
  getUserEdit: (req, res) => {
    const topFollowing = res.locals.data
    const userEditPage = true
    const user = helpers.getUser(req)
    return res.render('userEdit', {
      user,
      topFollowing,
      userEditPage
    })
  },

  putUserEdit: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findByPk(req.params.userId)
        .then((user) => {
          user.update({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })
            .then((user) => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${user.id}/edit`)
            })
        })
    }
  },

  //按讚
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    })
      .then((like) => {
        return res.redirect('back')
      })
  },

  //取消按讚
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      }
    })
      .then((like) => {
        // return console.log(like)
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },

  //追蹤使用者
  follow: async (req, res) => {
    try {
      const { id } = req.body
      if (Number(id) === helpers.getUser(req).id) {
        return res.json({ status: 'error' })
      }
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: id
      })
      return res.redirect('back')
    } catch (err) {
      return res.redirect('back')
    }
  },

  //取消追蹤使用者
  unFollow: async (req, res) => {
    try {
      const { userId } = req.params
      if (Number(userId) === helpers.getUser(req).id) {
        return res.redirect('back')
      }
      await Followship.destroy({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: userId
        }
      })

      return res.redirect('back')
    } catch (err) {
      return res.redirect('back')
    }
  },

  // 接收 /api/users callback 路由
  updateProfile: (req, res, next) => {
    apiController.postUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        next()
      }
      req.flash('success_messages', data['message'])
      next()
    })
  },

  //MiddleWare
  getUserInfo: (req, res, next) => {
    return User.findOne({
      where: {
        id: req.params.userId
      }
    }).then(user => {
      Followship.findAndCountAll({
        raw: true,
        nest: true,
        where: { followerId: user.id },
      }).then(following => {
        Followship.findAndCountAll({
          raw: true,
          nest: true,
          where: { followingId: user.id },
        }).then(follower => {
          res.locals.userInfo = {
            user: user.dataValues,
            followingCount: following.count,
            followerCount: follower.count,
            followers: follower.rows,
            followings: following.rows
          }
          return next()
        })
      })
    })
  },
}

module.exports = userController