const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const { Op } = require("sequelize")
const sequelize = require('sequelize')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const imgur = require('imgur-node-api')
const { fakeServer } = require('sinon')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (account.length < 5 || !name || name.length > 50 || !email || checkPassword !== password) {
      req.flash('error_messages', '表單內容不符合條件！')
      return res.redirect('/signup')
    }
    //註冊時，account 和 email 不能與其他人重覆
    User.findAll({
      raw: true, nest: true,
      where: { [Op.or]: [{ email }, { account }] }
    })
      .then(users => {
        if (users.some(item => item.account === account)) {
          req.flash('error_messages', '註冊失敗，account 已重覆註冊！')
          //64656
          return res.redirect('/signup')
        }
        if (users.some(item => item.email === email)) {
          req.flash('error_messages', '註冊失敗，email 已重覆註冊！')
          return res.redirect('/signup')
        }
        User.create({
          name,
          account,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_messages', 'Your account had been successfully registered!')
          return res.redirect('/signin')
        })
      })
  },
  // 測試完可刪
  // getUserEdit: (req, res) => {
  //   //檢查使用者是否在編輯自己的資料
  //   if (req.params.user_id !== String(helpers.getUser(req).id)) {
  //     req.flash('error_messages', '無法編輯其他使用者的資料')
  //     return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
  //   }
  //   User.findByPk(req.params.user_id)
  //     .then(user => {
  //       return res.render('tweets', { user: user.toJSON() })
  //     })
  //     .catch(err => console.log(err))
  // },

  getUserSetting: (req, res) => {
    //檢查使用者是否在編輯自己的資料
    if (req.params.user_id !== String(helpers.getUser(req).id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    User.findByPk(req.params.user_id)
      .then(user => {
        return res.render('setting', { user: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUserEdit: async (req, res) => {
    const { name, introduction } = req.body
    if (!name) {
      req.flash('error_messages', '暱稱不能空白！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }
    if (name.length > 50 || introduction.length > 160) {
      req.flash('error_messages', '字數超出上限！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }

    // const file = Object.assign({}, req.files)
    const { files } = req
    const user = await User.findByPk(req.params.user_id)

    // if (files) {
    //files會有[Object: null prototype] {}
    imgur.setClientID(IMGUR_CLIENT_ID)
    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: avaImg.data.link,
            cover: covImg.data.link
          })
          req.flash('success_messages', 'user profile was successfully updated!')
          return res.redirect('back')
        })
      }
      )
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avaImg.data.link,
        })
        req.flash('success_messages', 'user profile was successfully updated!')
        return res.redirect('back')
      })
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: covImg.data.link,
        })
        req.flash('success_messages', 'user profile was successfully updated!')
        return res.redirect('back')
      })
    } else {
      console.log('nofile', files)
      await user.update({
        name: req.body.name,
        introduction: req.body.introduction,
      })
      req.flash('success_messages', 'user profile was successfully updated!')
      return res.redirect('back')
    }
  },

  //testing upload multiple photos
  // putUserEdit: (req, res) => {
  //   //是否前端判斷？
  //   const { name, introduction } = req.body
  //   if(!name) {
  //     req.flash('error_messages', '暱稱不能空白！')
  //     return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
  //   }
  //     if(name.length > 50 || introduction.length > 160 ) {
  //     req.flash('error_messages', '字數超出上限！')
  //     return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
  //   }
  //   const files = Object.assign({}, req.files)
  //   console.log(files.ava)
  //   // const { files } = req

  //   if (files) {
  //     console.log(files.avatar[0])
  //     imgur.setClientID(IMGUR_CLIENT_ID)
  //     imgur.upload(files.avatar[0].path, (err, img) => {
  //       return User.findByPk(req.params.user_id)
  //         .then((user) => {
  //           console.log(img.data.link)
  //           user.update({
  //             name: req.body.name,
  //             introduction: req.body.introduction,
  //             avatar: files.avatar ? img.data.link : user.avatar,
  //             // cover: files ? img.data.link : user.cover
  //           })
  //             .then(() => {
  //               req.flash('success_messages', 'user profile was successfully updated!')
  //               res.redirect('/index')
  //             })
  //             .catch(err => console.error(err))
  //         })
  //     })
  //   } else {
  //     return User.findByPk(req.params.user_id)
  //       .then((user) => {
  //         user.update({
  //           name: req.body.name,
  //           introduction: req.body.introduction,
  //           avatar: user.avatar,
  //           cover: user.cover
  //         })
  //           .then(() => {
  //             req.flash('success_messages', 'user profile was successfully updated!')
  //             res.redirect('/index')
  //           })
  //           .catch(err => console.error(err))
  //       })

  //   }
  // },

  getUserTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.user_id },
        include: [
          { model: Like, include: [User] },
          { model: Reply, include: [User] },
        ]
      }),
      User.findAll({
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ]).then(([tweets, users]) => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        isLiked: r.dataValues.Likes.map(d => d.UserId).includes(req.user.id)
      }))
      //使用者（與其他重複）
      const currentUser = users.filter(obj => { return obj.dataValues.id === Number(req.params.user_id) })
      const isFollowed = currentUser[0].Followers.map((d) => d.id).includes(req.user.id)
      const topUsers = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: user.Followers.map(d => d.id).includes(req.user.id),
      }))
      topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('tweets', {
        data: data,
        currentUser: currentUser[0].toJSON(),
        isFollowed,
        topUsers
      })
    })
      .catch(err => console.log(err))
  },

  getUserReplied: (req, res) => {
    return Promise.all([
      Reply.findAll({
        where: { UserId: req.params.user_id },
        include: [
          { model: Tweet, include: [User] }
        ],
        raw: true, nest: true
      }),
      User.findAll({
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ]).then(([replies, users]) => {
      //使用者（與其他重複）
      const currentUser = users.filter(obj => { return obj.dataValues.id === Number(req.params.user_id) })
      const isFollowed = currentUser[0].Followers.map((d) => d.id).includes(req.user.id)
      const topUsers = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: user.Followers.map(d => d.id).includes(req.user.id)
      }))
      topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('replied', {
        data: replies,
        currentUser: currentUser[0].toJSON(),
        isFollowed,
        topUsers
      })
    })
  },

  getUserLikes: (req, res) => {
    return Promise.all([
      Like.findAll({
        where: { UserId: req.params.user_id },
        include: [
          { model: Tweet, include: [Reply, Like, User] }
        ],
      }),
      User.findAll({
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ]).then(([tweets, users]) => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        ...r.dataValues.Tweet.toJSON(),
        // description: r.dataValues.Tweet.dataValues.description.substring(0, 50),
        // userAvatar: r.dataValues.User.dataValues.avatar,
        // userName: r.dataValues.User.dataValues.name,
        // userAccount: r.dataValues.User.dataValues.name,
        isLiked: r.dataValues.Tweet.dataValues.Likes.map(d => d.UserId).includes(req.user.id)
      }))
      //使用者（與其他重複）
      console.log(data)
      const currentUser = users.filter(obj => { return obj.dataValues.id === Number(req.params.user_id) })
      const isFollowed = currentUser[0].Followers.map((d) => d.id).includes(req.user.id)
      const topUsers = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: user.Followers.map(d => d.id).includes(req.user.id)
      }))
      topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('likes', {
        data,
        currentUser: currentUser[0].toJSON(),
        isFollowed,
        topUsers
      })
    })
      .catch(err => console.log(err))
  },

  putUserSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    //後端驗證表單內容
    if (account.length < 5 || !name || name.length > 50 || !email || checkPassword !== password) {
      req.flash('error_messages', '表單內容不符合條件！')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    //編輯時，account 和 email 不能與其他人重覆
    User.findAll({
      raw: true, nest: true,
      where: {
        [Op.or]: [{ email }, { account }],
        id: { [Op.ne]: helpers.getUser(req).id }
      }
    })
      .then(users => {
        if (users.some(item => item.account === account)) {
          req.flash('error_messages', 'account 已被他人使用！')
          return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
        }
        if (users.some(item => item.email === email)) {
          req.flash('error_messages', 'email 已被他人使用！')
          return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
        }
        return User.findByPk(req.params.user_id)
          .then((user) => {
            user.update({
              account,
              name,
              email,
              password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password
            })
              .then(() => {
                req.flash('success_messages', '使用者設定已成功被更新!')
                res.redirect(`/tweets`)
              })
              .catch(err => console.error(err))
          })
      })
  },


  signInPage: (req, res) => {
    return res.render('signIn')
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
}



module.exports = userController