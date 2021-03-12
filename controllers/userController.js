const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const Followship = db.Followship
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Message = db.Message
const sequelize = require('sequelize')
const getTopUser = require('../_helpers').getTopUser

//sequelize literal
function tweetsCouont(id) {
  return `(
    SELECT COUNT(*)
              FROM Tweets AS Tweet
              WHERE Tweet.UserId = ${id}
  )`
}
function followingCount(id) {
  return `(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followerId = ${id}
          )`
}
function followerCount(id) {
  return `(
              SELECT COUNT(*)
              FROM Followships As Followship
              WHERE Followship.followingId = ${id}
            )`
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//check 
function isLiked(req, tweet) {
  return helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(tweet.id) : false
}

function checkIsFollowed(req, userId) {
  return helpers.getUser(req).Followings ? helpers.getUser(req).Followings.map(d => d.id).includes(Number(userId)) : false
}

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID



const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  ///signup test
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signin')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signin')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複')
              return res.redirect('/signin')
            } else
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signup')
              })
          })

        }
      })
    }
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

  addFollowing: async (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.body.id)) {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      return res.redirect('back')
    }
    return res.redirect(200, 'back')
  },

  removeFollowing: async (req, res) => {
    const awaitRemove = await Followship.findOne({
      where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
    })
    await awaitRemove.destroy()
    req.flash('success_messages', '成功取消追隨')
    return res.redirect('back')
  },

  getUserPage: async (req, res) => {
    const users = await getTopUser(req)
    let userView = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(tweetsCouont(req.params.id)),
            'TweetsCount'
          ],
          [
            sequelize.literal(followingCount(req.params.id)),
            'FollowingCount'
          ],
          [
            sequelize.literal(followerCount(req.params.id)),
            'FollowerCount'
          ]
        ]
      },
      include: [
        { model: Tweet, include: [Reply, Like] }
      ],
      order: [
        [Tweet, 'createdAt', 'DESC']
      ]
    })
    userView = userView.toJSON()
    if (userView.Tweets) {
      userView.Tweets.map(t => {
        t.totalReplies = t.Replies.length
        t.totalLikes = t.Likes.length
        t.isLiked = isLiked(req, t)
      })
    }
    const isFollowed = checkIsFollowed(req, req.params.id)

    return res.render('user', { userView, users, isFollowed })
  },


  getUserTweetsRepliesPage: async (req, res) => {
    //user data to show top 10 user
    const users = await getTopUser(req)
    let userView = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(tweetsCouont(req.params.id)),
            'TweetsCount'
          ],
          [
            sequelize.literal(followingCount(req.params.id)),
            'FollowingCount'
          ],
          [
            sequelize.literal(followerCount(req.params.id)),
            'FollowerCount'
          ]
        ]
      },
      include: [
        { model: Reply, include: [{ model: Tweet, include: [Reply, Like] }] }
      ],
      order: [
        [Reply, 'createdAt', 'DESC']
      ]
    })
    userView = userView.toJSON()
    if (userView.Replies) {
      userView.Replies.map(r => {
        r.Tweet.description = `${r.Tweet.description.substring(0, 20)}...`
        r.Tweet.isLiked = isLiked(req, r.Tweet)
        r.Tweet.totalReplies = r.Tweet.Replies.length
        r.Tweet.totalLikes = r.Tweet.Likes.length
      })
    }
    const isFollowed = checkIsFollowed(req, userView.id)

    return res.render('tweetsReplies', { users, userView, isFollowed })
  },


  getUserLikesPage: async (req, res) => {
    let userView = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(tweetsCouont(req.params.id)),
            'TweetsCount'
          ],
          [
            sequelize.literal(followingCount(req.params.id)),
            'FollowingCount'
          ],
          [
            sequelize.literal(followerCount(req.params.id)),
            'FollowerCount'
          ]
        ]
      },
      include: [
        { model: Like, include: [{ model: Tweet, include: [User, Reply, Like] }] }
      ],
      order: [
        [Like, 'createdAt', 'DESC'],
      ]
    })
    userView = userView.toJSON()
    if (userView.Likes) {
      userView.tweets = userView.Likes.map(like => {
        return like.Tweet
      })
      userView.tweets.map(t => {
        t.totalReplies = t.Replies.length
        t.totalLikes = t.Likes.length
        t.isLiked = isLiked(req, t)
      })
    }
    const isFollowed = checkIsFollowed(req, userView.id)
    const users = await getTopUser(req)
    return res.render('likes', { userView, users, isFollowed })
  },


  editUserFromEditPage: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    let avatar, cover
    if (req.files) {
      avatar = req.files.avatar
      cover = req.files.cover
    }
    let avatarLink, coverLink = ''
    if (!avatar && !cover) {
      await user.update({
        avatar: user.avatar,
        cover: user.cover,
        name: req.body.name,
        introduction: req.body.introduction
      })
      return res.status(200).json({ status: 'success', message: '修改成功' })
    }
    imgur.setClientId(IMGUR_CLIENT_ID)
    if (avatar) {
      avatarLink = await helpers.imgPromise(avatar[0])
    }
    if (cover) {
      coverLink = await helpers.imgPromise(cover[0])
    }
    await user.update({
      avatar: avatarLink ? avatarLink : user.avatar,
      cover: coverLink ? coverLink : user.cover,
      name: req.body.name,
      introduction: req.body.introduction ? req.body.introduction : user.introduction
    })
    return res.status(200).json({ status: 'success', message: '修改成功' })
  },

  getUserFollowingPage: async (req, res) => {
    //userView為了partials左邊nav的user.id區隔開
    let userView = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(tweetsCouont(req.params.id)),
            'TweetsCount'
          ],
          [
            sequelize.literal(followingCount(req.params.id)),
            'FollowingCount'
          ]
        ]
      },
      include: [
        { model: User, as: 'Followings' }
      ]
    })
    userView = userView.toJSON()
    const users = await getTopUser(req)
    return res.render('userFollowing', { userView, users })
  },
  getUserFollowerPage: async (req, res) => {
    //userView為了partials左邊nav的user.id區隔開
    let userView = await await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(tweetsCouont(req.params.id)),
            'TweetsCount'
          ],
          [
            sequelize.literal(followerCount(req.params.id)),
            'FollowerCount'
          ]
        ]
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    })
    userView = userView.toJSON()
    userView.Followers.map(user => {
      user.isFollowed = checkIsFollowed(req, user.id)
    })
    const users = await getTopUser(req)
    return res.render('userFollower', { userView, users })
  },

  setUserPage: async (req, res) => {
    return User.findByPk(req.params.id, { raw: true }).then(user => {
      return res.render('userSet', { user: user })
    })
  },

  setUser: async (req, res) => {
    const id = req.params.id
    const { email: originalEmail, account: originalAccount } = helpers.getUser(req)
    const { account, name, email, password, passwordCheck } = req.body
    let newEmail = ''
    let newAccount = ''
    if (originalEmail === email) { newEmail = originalEmail }
    if (originalAccount === account) { newAccount = originalAccount }
    if (originalEmail !== email) {
      await User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '該信箱已有人使用')
            return res.redirect('back')
          } else {
            newEmail = email
          }
        })
    }
    if (originalAccount !== account) {
      await User.findOne({ where: { account } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '該帳號已有人使用')
            return res.redirect('back')
          } else {
            newAccount = account
          }
        })
    }
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次輸入的密碼不同')
      return res.redirect('back')
    }
    return User.findByPk(id)
      .then((user) => {
        user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
          .then((user) => {
            req.flash('success_messages', '更新成功')
            return res.redirect('/tweets')
          })
      })
  },

  getUserData: async (req, res) => {
    let user = await User.findByPk(req.params.id)
    user = user.toJSON()
    return res.status(200).json(user)
  },


  getChatRoom: async (req, res) => {
    let historyMsgs = await Message.findAll({
      raw: true, nest: true,
      include: [User]
    })

    return res.render('chatroom', { historyMsgs })
  },

}

module.exports = userController