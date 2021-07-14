const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship
const Reply = db.Reply

const helpers = require('../_helpers')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  //註冊
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
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
    const topFollowing = res.locals.data
    const top5Following = topFollowing.slice(0, 5)
    const userInfo = res.locals.userInfo
    try {
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: {
          UserId: userInfo.user.id
        },
        include: [Tweet]
      })

      let Data = []
      Data = replies.map(async (reply, index) => {
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
            createdAt: reply.createdAt,
            comment: reply.comment,
            TweetId: reply.TweetId,
            tweetDescription: reply.Tweet.description,
            tweetCreatedAt: reply.Tweet.createdAt,
            tweetUserId: tweetUser.id,
            tweetUserName: tweetUser.name,
            tweetUserAvatar: tweetUser.avatar,
            tweetUserAccount: tweetUser.account,
            likeCount: likes.count,
            replyCount: replies.count,
          }
        }
      })
      Promise.all(Data).then(data => {
        // console.log(data)
        data = data.sort((a, b) => a.tweetCreatedAt - b.tweetCreatedAt)
        return res.render('replies', {
          user: userInfo.user,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          replies: data,
          topFollowing: top5Following
        })
      })
    }
    catch (err) {
      console.log('getUserReplies err')
      return res.render('/')
    }
  },
  getUserLikes: async (req, res) => {
    const topFollowing = res.locals.data
    const userInfo = res.locals.userInfo
    try {
      const likes = await Like.findAll({
        raw: true,
        nest: true,
        where: {
          UserId: userInfo.user.id
        },
        include: [Tweet]
      })

      let Data = []
      Data = likes.map(async (like, index) => {
        const [tweetUser, likes, replies] = await Promise.all([
          User.findOne({
            raw: true,
            nest: true,
            where: {
              id: like.Tweet.UserId
            }
          }),
          Like.findAndCountAll({
            raw: true,
            nest: true,
            where: {
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
          likeCount: likes.count,
          replyCount: replies.count,
          tweet: like.Tweet
        }
      })
      Promise.all(Data).then(data => {
        data = data.sort((a, b) => a.tweet.createdAt - b.tweet.createdAt)
        return res.render('likes', {
          user: userInfo.user,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          likes: data,
          topFollowing: top5Following
        })
      })
    }
    catch (err) {
      console.log('getUserLikes err')
      return res.render('/')
    }
  },

  // getUserTweets: async (req, res) => {
  //   try {
  //     const topFollowing = res.locals.data
  //     const user = {
  //       id: helpers.getUser(req).id,
  //       avatar: helpers.getUser(req).avatar,
  //       name: helpers.getUser(req).name,
  //       account: helpers.getUser(req).account,
  //     }

  //     const tweets = await Tweet.findAll({
  //       raw: true,
  //       nest: true,
  //       attributes: ['id', 'description', 'createdAt'],
  //       where: { UserId: req.params.userId },
  //       order: [['updatedAt', 'DESC']]
  //     })

  //     let Data = []
  //     Data = tweets.rows.map(async (tweet, index) => {
  //       const [replyCount, likeCount] = await Promise.all([
  //         Reply.findAndCountAll({
  //           raw: true,
  //           nest: true,
  //           where: { TweetId: tweet.id },
  //         }),
  //         Like.findAndCountAll({
  //           raw: true,
  //           nest: true,
  //           where: { TweetId: tweet.id },
  //         }),
  //       ])
  //       return {
  //         ...tweet,
  //         replyCount: replyCount.count,
  //         likeCount: likeCount.count
  //       }
  //     })
  //     Promise.all(Data).then(data => {
  //       return res.render('index', {
  //         data,
  //         user,
  //         topFollowing,
  //       })
  //     })
  //   } catch (err) {
  //     console.warn(err)
  //     // return res.redirect('/') // 假定回到首頁
  //   }
  // },

  getUserTweets: async (req, res) => {
    try {
      const topFollowing = res.locals.data
      const user = helpers.getUser(req)
      const userInfo = res.locals.userInfo
      let myPage = true
      if (Number(req.params.userId) !== helpers.getUser(req).id) {
        myPage = false
      }

      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.userId },
        order: [['createdAt', 'DESC']]
      })

      let Data = []
      Data = tweets.map(async (tweet, index) => {
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
      console.log(userInfo.user.cover)
      console.log('-------')
      Promise.all(Data).then(data => {
        return res.render('tweets', {
          user,
          thisUser: userInfo.user,
          followingCount: userInfo.followingCount,
          followerCount: userInfo.followerCount,
          data,
          topFollowing,
          myPage
        })
      })
    } catch (err) {
      console.warn(err)
    }
  },
  //進入帳號設定頁面
  getUserEdit: (req, res) => {
    const topFollowing = res.locals.data
    const userEditPage = true
    const user = {
      id: helpers.getUser(req).id,
      name: helpers.getUser(req).name,
      account: helpers.getUser(req).account,
      email: helpers.getUser(req).email,
      avatar: helpers.getUser(req).avatar,
    }
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
            followerCount: follower.count
          }
          return next()
        })
      })
    })
  },
}
module.exports = userController