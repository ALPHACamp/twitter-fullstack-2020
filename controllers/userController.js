const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship, ReplyComment } = db
const helpers = require('../_helpers')
const fs = require('fs')
const { resolve } = require('path')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
let more = 10

const userController = {
  registerPage: (req, res) => {
    return res.render('register', { layout: 'mainLogin' })
  },

  register: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          $or: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱或賬號重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  loginPage: (req, res) => {
    return res.render('login', { layout: 'mainLogin' })
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/signin')
  },

  likeTweet: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    })
      .then(like => {
        return res.redirect('back')
      })
  },

  unlikeTweet: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      }
    })
      .then(like => {
        like.destroy()
          .then(like => {
            return res.redirect('back')
          })
      })
  },

  likeReply: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      ReplyId: req.params.replyId
    })
      .then(like => {
        return res.redirect('back')
      })
  },

  dislikeReply: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        ReplyId: req.params.replyId
      }
    })
      .then(like => {
        like.destroy()
          .then(like => {
            return res.redirect('back')
          })
      })
  },

  postFollowing: (req, res) => {
    if (Number(req.body.id) === Number(helpers.getUser(req).id)) {
      return res.render('tweets')
      //return res.redirect('back')
    }
    else {
      Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
        .then(followship => {
          return res.redirect('back')
        })
    }
  },

  deleteFollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(followship => {
            return res.redirect('back')
          })
      })
  },

  adminLoginPage: (req, res) => {
    return res.render('admin/login', { layout: 'mainLogin' })
  },

  adminLogin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },

  adminLogout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/admin/login')
  },

  getUserSettings: (req, res) => {
    const reqUser = helpers.getUser(req)
    return User.findByPk(reqUser.id).then(user => {
      return res.render('settings', {
        user: user.toJSON()
      })
    })
  },

  putUserSettings: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const id = req.params.id
    let passwordCheck = false
    // check user auth
    if (helpers.getUser(req).id !== Number(id)) {
      req.flash('error_messages', 'You can only edit your account')
      return res.redirect('back')
    }
    // check data
    if (!account || !name || !email) {
      req.flash('error_messages', 'Account/Name/Email should not be empty')
      return res.redirect('back')
    }
    // check password
    if (password && !checkPassword) {
      req.flash('error_messages', 'Please confirm password')
      passwordCheck = false
      return res.redirect('back')
    }
    if (!password && checkPassword) {
      req.flash('error_messages', 'Password should not be empty')
      passwordCheck = false
      return res.redirect('back')
    }
    if (password || checkPassword) {
      if (password !== checkPassword) {
        req.flash('error_messages', 'Password and confirmed Password are not matched')
        passwordCheck = false
        return res.redirect('back')
      } else {
        passwordCheck = true
      }
    }
    if (passwordCheck) {
      // user change password
      return User.findByPk(id).then(user => {
        user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      }).then(user => {
        req.flash('success_messages', '輸入成功！')
        return res.redirect('back')
      }).catch(err => console.log(err))
    } else {
      // user not change password
      return User.findByPk(id).then(user => {
        user.update({
          account,
          name,
          email
        })
      }).then(user => {
        req.flash('success_messages', '輸入成功！')
        return res.redirect('back')
      }).catch(err => console.log(err))
    }
  },

  getUserTweets: (req, res) => {
    const reqUserId = req.params.userId
    const loginUser = helpers.getUser(req)
    return User.findByPk(reqUserId, {
      order: [[{ model: Tweet }, 'createdAt', 'DESC']],
      include: [
        { model: Tweet, include: [Like, Reply] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      console.log(user)
      const tweets = user.toJSON().Tweets.map(tweet => ({
        id: user.toJSON().id,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        description: tweet.description ? tweet.description.substring(0, 160) : 0,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        tweetId: tweet.id,
        isLiked: loginUser.Likes.map(like => like.TweetId).includes(tweet.id)
      }))
      // Right side
      // filter the tweets to those that user followings & user himself
      const tweetFollowings = []
      // Top 10 followers
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          isFollowing: user.Followers.map(follower => follower.id).includes(loginUser.id)
        }))
        //sort by the amount of the followers
        users.sort((a, b) => {
          return b.Followers.length - a.Followers.length
        })
        //more followers
        if (req.query.more) {
          more = more + 10
        }
        users = users.slice(0, more)

        return res.render('userTweets', {
          tweets,
          userId: user.toJSON().id,
          cover: user.toJSON().cover,
          avatar: user.toJSON().avatar,
          account: user.toJSON().account,
          name: user.toJSON().name,
          introduction: user.toJSON().introduction,
          followingsCount: user.toJSON().Followings.length,
          followersCount: user.toJSON().Followers.length,
          tweetsCount: tweets.length,
          tweetFollowings,
          loginUser,
          users
        })
      })
    })
  },

  getUserReplies: (req, res) => {
    const reqUserId = req.params.userId
    const loginUser = helpers.getUser(req)
    return User.findByPk(reqUserId, {
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        {
          model: Reply,
          include: [
            { model: Tweet, include: [User, Reply, Like] },
            { model: ReplyComment },
            { model: Like }
          ]
        },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ]
    }).then(user => {
      const replies = user.toJSON().Replies.map(reply => ({
        // Reply
        ...reply,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        comment: reply.comment,
        updatedAt: reply.updatedAt,
        replyCommentsCount: reply.ReplyComments.length,
        replyLikeCount: reply.Likes.length,
        isReplyLiked: loginUser.Likes.map(like => like.ReplyId).includes(reply.id),
        // Tweet
        tweetId: reply.TweetId,
        tweetUserAccount: reply.Tweet.User.account,
        tweetUserName: reply.Tweet.User.name,
        tweetDescription: reply.Tweet.description.substring(0, 160),
        replyCount: reply.Tweet.Replies.length,
        tweetLikeCount: reply.Tweet.Likes.length,
        isLiked: loginUser.Likes.map(like => like.TweetId).includes(reply.TweetId)
      }))
      // Right side
      // filter the tweets to those that user followings & user himself
      const tweetFollowings = []
      // Top 10 followers
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          isFollowing: user.Followers.map(follower => follower.id).includes(loginUser.id)
        }))
        //sort by the amount of the followers
        users.sort((a, b) => {
          return b.Followers.length - a.Followers.length
        })
        //more followers
        if (req.query.more) {
          more = more + 10
        }
        users = users.slice(0, more)
        return res.render('userReplies', {
          replies,
          userId: user.toJSON().id,
          cover: user.toJSON().cover,
          avatar: user.toJSON().avatar,
          account: user.toJSON().account,
          name: user.toJSON().name,
          introduction: user.toJSON().introduction,
          followingsCount: user.toJSON().Followings.length,
          followersCount: user.toJSON().Followers.length,
          tweetsCount: user.toJSON().Tweets.length,
          tweetFollowings,
          loginUser,
          users
        })
      })
    })
  },

  getUserLikes: (req, res) => {
    const reqUserId = req.params.userId
    const loginUser = helpers.getUser(req)
    return User.findByPk(reqUserId, {
      order: [[{ model: Like }, 'createdAt', 'DESC']],
      include: [ // TweetId: { $gt: 0 } --> TweetId大於0, 用來排除TweetID=Null (like reply)的情況
        { model: Like, where: { TweetId: { $gt: 0 } }, include: [{ model: Tweet, include: [User, Reply, Like] }] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ]
    }).then(user => {
      const likes = user.toJSON().Likes.map(like => ({
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        description: like.Tweet.description ? like.Tweet.description.substring(0, 160) : 0,
        // description: like.Tweet.description,
        updatedAt: like.Tweet.updatedAt,
        replyCount: like.Tweet.Replies.length,
        likeCount: like.Tweet.Likes.length,
        tweetId: like.TweetId,
        isLiked: loginUser.Likes.map(l => l.TweetId).includes(like.TweetId)
      }))
      // Right side
      // filter the tweets to those that user followings & user himself
      const tweetFollowings = []
      // Top 10 followers
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          isFollowing: user.Followers.map(follower => follower.id).includes(loginUser.id)
        }))
        //sort by the amount of the followers
        users.sort((a, b) => {
          return b.Followers.length - a.Followers.length
        })
        //more followers
        if (req.query.more) {
          more = more + 10
        }
        users = users.slice(0, more)
        return res.render('userLikes', {
          likes,
          userId: user.toJSON().id,
          cover: user.toJSON().cover,
          avatar: user.toJSON().avatar,
          account: user.toJSON().account,
          name: user.toJSON().name,
          introduction: user.toJSON().introduction,
          followingsCount: user.toJSON().Followings.length,
          followersCount: user.toJSON().Followers.length,
          tweetsCount: user.toJSON().Tweets.length,
          tweetFollowings,
          loginUser,
          users
        })
      })
    })
  },

  getUserFollowers: (req, res) => {
    const reqUserId = req.params.userId
    const loginUser = helpers.getUser(req)
    return User.findByPk(reqUserId, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      const tweetsCount = users.toJSON().Tweets.length
      const name = users.toJSON().name
      users = users.Followers.map(r => ({
        ...r.dataValues,
        avatar: r.avatar,
        account: r.account,
        name: r.name,
        introduction: r.introduction ? r.introduction.substring(0, 140) : 0,
        followshipCreatedAt: r.Followship.createdAt,
        // 追蹤者人數
        followerCount: users.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(r.id)
      }))
      // 排序
      users = users.sort((a, b) => b.followshipCreatedAt - a.followshipCreatedAt)

      return res.render('userFollowers', {
        users: users,
        name: name,
        tweetsCount: tweetsCount
      })
    })
  },

  getUserFollowings: (req, res) => {
    const reqUserId = req.params.userId
    const loginUser = helpers.getUser(req)
    return User.findByPk(reqUserId, {
      include: [
        Tweet,
        { model: User, as: 'Followings' }
      ]
    }).then(users => {

      console.log(users)
      
      const tweetsCount = users.toJSON().Tweets.length
      const name = users.toJSON().name
      users = users.Followings.map(r => ({
        ...r.dataValues,
        avatar: r.avatar,
        account: r.account,
        name: r.name,
        introduction: r.introduction ? r.introduction.substring(0, 140) : 0,
        followshipCreatedAt: r.Followship.createdAt,
        // 追蹤者人數
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(r.id)
      }))

      
      // 排序
      users = users.sort((a, b) => b.followshipCreatedAt - a.followshipCreatedAt)
      return res.render('userFollowings', {
        users: users,
        name: name,
        tweetsCount: tweetsCount
      })
    })
  },
  
  putUserInfo: (req, res) => {
    const { name, introduction } = req.body
    const id = req.params.userId
    console.log('req.files:', req.files)
    // check user auth
    if (helpers.getUser(req).id !== Number(id)) {
      req.flash('error_messages', 'You can only edit your account')
      return res.redirect('back')
    }
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { files } = req
    // upload cover
    const uploadCover = new Promise((resolve, reject) => {
      let coverURL = ''
      if (files.cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(files.cover[0].path, (err, img) => {
          if (err) return reject(err)
          coverURL = img.data.link
          resolve(coverURL)
        })
      } else {
        coverURL = null
        resolve(coverURL)
      }
    })
    // upload avatar
    const uploadAvatar = new Promise((resolve, reject) => {
      let avatarURL = ''
      if (files.avatar) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(files.avatar[0].path, (err, img) => {
          if (err) return reject(err)
          avatarURL = img.data.link
          resolve(avatarURL)
        })
      } else {
        avatarURL = null
        resolve(avatarURL)
      }
    })
    // update All
    async function updateUser() {
      try {
        const [coverURL, avatarURL] = await Promise.all([uploadCover, uploadAvatar])
        return User.findByPk(id).then(user => {
          user.update({
            name: name,
            introduction: introduction,
            cover: coverURL || user.cover,
            avatar: avatarURL || user.avatar
          })
        }).then((user) => {
          req.flash('success_messages', 'User information updated success.')
          return res.redirect('/users/' + id + '/tweets')
          // return res.redirect('/')
        })
      } catch (err) {
        console.log('Error:', err)
      }
    }
    updateUser()
  },
  getUserInfo: (req, res) => {
    const id = req.params.userId
    const loginId = helpers.getUser(req).id
    // check user auth
    if (loginId !== Number(id)) {
      req.flash('error_messages', 'You can only edit your account')
      return res.redirect('/users/' + loginId + '/tweets')
    }
    return User.findByPk(id).then(user => {
      return res.render('userInfo', {
        ...user.toJSON()
      })
    })
  }
}

module.exports = userController