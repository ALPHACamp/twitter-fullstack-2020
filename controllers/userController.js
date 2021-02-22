const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const axios = require('axios')
const helpers = require('../_helpers')

const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Like, Tweet, Reply, Followship } = db

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  //////////////
  //log out
  //////////////
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  /// /////
  // login
  /// /////
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else if (req.body.account.indexOf(" ") >= 0) {
      req.flash('error_messages', '帳號不能有空格！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(mailuser => {
        if (mailuser) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複！')
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
  /// /////
  // setting
  /// /////
  getSetting: (req, res) => {
    return res.render('setting')
  },
  updateSetting: (req, res) => {
    if (!req.body.account) {
      req.flash('error_messages', "account didn't exist")
      return res.redirect('back')
    }

    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    if (!req.body.email) {
      req.flash('error_messages', "email didn't exist")
      return res.redirect('back')
    }

    if (req.body.password !== req.body.checkPassword) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('back')
    }

    User.findOne({ where: { id: { [Op.ne]: req.user.id }, email: req.body.email } }).then(mailuser => {
      if (mailuser) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('back')
      } else {
        User.findOne({ where: { id: { [Op.ne]: req.user.id }, account: req.body.account } }).then(user => {
          if (user) {
            req.flash('error_messages', '帳號重複！')
            return res.redirect('back')
          } else {
            if (!req.body.password) {
              return User.findByPk(req.user.id)
                .then((user) => {
                  user.update({
                    account: req.body.account,
                    name: req.body.name,
                    email: req.body.email
                  })
                    .then((user) => {
                      req.flash('success_messages', 'setting infomation was successfully to update')
                      res.redirect('setting')
                    })
                })
            } else {
              return User.findByPk(req.user.id)
                .then((user) => {
                  user.update({
                    account: req.body.account,
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                  })
                    .then((user) => {
                      req.flash('success_messages', 'setting infomation was successfully to update')
                      res.redirect('setting')
                    })
                })
            }
          }
        })
      }
    })
  },

  /// ///////////
  // Profile
  /// ///////////
  getUserProfile: async (req, res) => {
    let profileUser = await User.findByPk(req.params.id, {
      include: [
        { model: Reply, include: [Tweet] },
        { model: Tweet, include: [User, Like, Reply] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    profileUser = profileUser.dataValues

    const target = req.query.target || 'tweets'
    if (target === 'replies') {
      profileUser.Tweets = await Tweet.findAll({
        include: [User, Like, Reply]
      })
      profileUser.Tweets.filter(tweet => tweet.dataValues.Replies.map(d => d.dataValues.UserId).includes(profileUser.id))
    }
    if (target === 'likes') {
      profileUser.Tweets = await Tweet.findAll({
        include: [User, Like, Reply]
      })
      profileUser.Tweets = profileUser.Tweets.filter(tweet => tweet.dataValues.Likes.map(d => d.dataValues.UserId).includes(profileUser.id))
    }

    profileUser.Tweets = profileUser.Tweets.map(tweet => ({
      ...tweet.dataValues,
      tweetLiked: tweet.Likes.filter(like => like.likeOrNot === true).length,
      tweetDisliked: tweet.Likes.filter(unlike => unlike.likeOrNot === false).length,
      latestReplytime: Math.max(...tweet.Replies.map(reply => reply.updatedAt)),
      latestLiketime: Math.max(...tweet.Likes.map(like => like.updatedAt))
    }))

    const isFollowed = req.user.Followings.map(d => d.id).includes(profileUser.id)

    if (target === "tweets") {
      profileUser.Tweets = profileUser.Tweets.sort((a, b) => b.updatedAt - a.updatedAt)
    } else if (target === "replies") {
      profileUser.Tweets = profileUser.Tweets.sort((a, b) => b.latestReplytime - a.latestReplytime)
    } else if (target === "likes") {
      profileUser.Tweets = profileUser.Tweets.sort((a, b) => b.latestLiketime - a.latestLiketime)
    }


    const id = helpers.getUser(req).id
    return res.render('userProfile', { profileUser, isFollowed, target })
  },

  updateProfile: (req, res) => {
    const { name, introduction } = req.body
    const id = helpers.getUser(req).id
    const { files } = req

    if (files) {
      const fieldName = Object.keys(files)[0];
      let file = ""
      if (fieldName === 'avatar') {      //判斷檔案是avatar或cover
        file = files.avatar[0]
      } else {
        file = files.cover[0]
      }
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        console.log(img)
        return User.findByPk(id)
          .then((user) => {
            user.update({
              cover: file.fieldname === "cover" ? img.data.link : user.cover,
              avatar: file.fieldname === "avatar" ? img.data.link : user.avatar,
              name: user.name,
              introduction: user.introduction
            })
              .then((user) => {
                return res.redirect(`/user/${id}`)
              }).catch(err => console.log(err))
          })
      })
    }
    else {
      return User.findByPk(id)
        .then(user => {
          user.update({
            cover: user.cover,
            avatar: user.avatar,
            name: name ? name : user.name,
            introduction: introduction ? introduction : user.introduction
          }).then((user) => {
            return res.redirect(`/user/${id}`)
          }).catch(err => console.log(err))
        })
    }
  },

  deleteImage: (req, res) => {
    const id = helpers.getUser(req).id
    User.findByPk(id)
      .then(user => {
        user.update({ cover: null })
        return res.redirect(`/user/${id}`)
      }).catch(err => console.log(err))
  },

  /// ///////////
  // FollowShip
  /// ///////////
  getUserFollowShip: async (req, res) => {
    let profileUser = await User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers', include: [{ model: User, as: 'Followers' }] },
        { model: User, as: 'Followings', include: [{ model: User, as: 'Followings' }] }
      ]
    })
    profileUser = profileUser.dataValues

    const target = req.query.target || 'follower'

    if (target === 'follower') {
      profileUser.Followers = profileUser.Followers.map(follower => ({
        ...follower.dataValues,
        relate: follower.Followers.map(d => d.dataValues.id).includes(profileUser.id)
      }))
    }

    if (target === 'following' || target === 'both') {
      profileUser.Followings = profileUser.Followings.map(following => ({
        ...following.dataValues,
        relate: following.Followings.map(d => d.dataValues.id).includes(profileUser.id)
      }))
    }

    return res.render('userFollowship', { profileUser, target })
  },

  postUserFollowShip: (req, res) => {
    if (Number(req.user.id) === Number(req.params.id)) {
      return res.redirect('back')
    } else {
      Followship.create({
        followerId: req.user.id,
        followingId: req.params.id
      })
        .then(user => {
          return res.redirect('back')
        })
    }
  },

  deleteUserFollowShip: (req, res) => {
    Followship.findOne({
      where: { followerId: req.user.id, followingId: req.params.id }
    }).then(followship => {
      console.log("before delete=", followship)
      followship.destroy()
        .then((u) => {
          return res.status(302).json({ status: 'success', message: "" })
          return res.redirect('back')
        })
    })
  },

  /// ///////////
  // Users
  /// ///////////
  getUsers: (req, res) => {
    User.findAll({
      where: { role: '' }, include: [Tweet, Like, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          tweetCount: user.Tweets.length,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length,
          tweetLiked: user.Likes.filter(like => like.likeOrNot === true).length,
          tweetDisliked: user.Likes.filter(unlike => unlike.likeOrNot === false).length
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount)
        return res.render('users', { users })
      }).catch(err => console.log(err))
  },

  /// ///////////
  // FollowShip API
  /// ///////////
  postFollowShips_json: (req, res, callback) => {
    const id = helpers.getUser(req).id
    if (Number(id) === Number(req.body.id)) {
      return res.status(200).json({ status: 'error', message: "you can't follow yourself." })
    } else {
      Followship.create({
        followerId: id,
        followingId: req.body.id
      })
        .then(user => {
          return res.status(302).json({ status: 'success', message: "" })
        })
    }
  },

  deleteFollowShips_json: (req, res, callback) => {
    const id = helpers.getUser(req).id
    Followship.findOne({
      where: { followerId: id, followingId: req.params.id }
    }).then(followship => {
      if (followship) {
        followship.destroy()
          .then((u) => {
            return res.status(302).json({ status: 'success', message: "" })
          })
      } else {
        return res.json({ status: 'error', message: "there are no data." })
      }
    })
  },

  /// ///////////
  // User API
  /// ///////////
  getUserTweets: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [{ model: Tweet }]
    })
      .then(user => {
        return res.status(200).json({ status: 'success', message: "tweets", user: user })
      })
  },

  getUserFollowings: async (req, res, callback) => {
    let profileUser = await User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers', include: [{ model: User, as: 'Followers' }] },
        { model: User, as: 'Followings', include: [{ model: User, as: 'Followings' }] }
      ]
    })
    profileUser = profileUser.dataValues
    profileUser.Followings = profileUser.Followings.map(following => ({
      ...following.dataValues,
      relate: following.Followings.map(d => d.dataValues.id).includes(profileUser.id)
    })
    )
    profileUser.Followings = profileUser.Followings.sort((a, b) => b.updatedAt - a.updatedAt)
    return res.status(200).json({ status: 'success', message: "", profileUser: profileUser })
  },

  getUserFollowers: async (req, res, callback) => {
    let profileUser = await User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers', include: [{ model: User, as: 'Followers' }] },
        { model: User, as: 'Followings', include: [{ model: User, as: 'Followings' }] }
      ]
    })
    profileUser = profileUser.dataValues
    profileUser.Followers = profileUser.Followers.map(follower => ({
      ...follower.dataValues,
      relate: follower.Followers.map(d => d.dataValues.id).includes(profileUser.id)
    })
    )
    profileUser.Followers = profileUser.Followers.sort((a, b) => b.updatedAt - a.updatedAt)
    return res.status(200).json({ status: 'success', message: "", profileUser: profileUser })
  },
  getUserLikes: async (req, res, callback) => {
    let likedTweets = await Like.findAll({
      include: [Tweet]
    })
    return res.status(200).json({ status: 'success', message: "", likedTweets: likedTweets })
  }
}

module.exports = userController
