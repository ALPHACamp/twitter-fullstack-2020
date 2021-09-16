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

  putUserEdit: (req, res) => {
    const { name, introduction } = req.body
    if (!name) {
      req.flash('error_messages', '暱稱不能空白！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }
    if (name.length > 50 || introduction.length > 160) {
      req.flash('error_messages', '字數超出上限！')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.user_id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar,
              // cover: file ? img.data.link : user.cover
            })
              .then(() => {
                req.flash('success_messages', 'user profile was successfully updated!')
                res.redirect('/tweets')
              })
              .catch(err => console.error(err))
          })
      })
    } else {
      return User.findByPk(req.params.user_id)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            // cover: user.cover
          })
            .then(() => {
              req.flash('success_messages', 'user profile was successfully updated!')
              res.redirect('/tweets')
            })
            .catch(err => console.error(err))
        })

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
        ],
      }),
      User.findByPk(req.params.user_id, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
    ]).then(([tweets, user]) => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        likeCount: r.Likes.length,
        replyCount: r.Replies.length
      }))
      const isFollowed = user.Followers.map((d) => d.id).includes(req.user.id)
      console.log(isFollowed)
      console.log(user.Followers.length)
      return res.render('tweets', {
        data: data,
        viewUser: user.toJSON(),
        isFollowed
      })
    })
      .catch(err => console.log(err))
  },

  getUserLikes: (req, res) => {
    // Tweet.findAll({
    //   where: { UserId: req.params.user_id },
    //   include: [User, { model: Like, include: [User] }, { model: Reply, include: [User] }],
    //   // raw: true, nest: true
    // }).then((tweets) => {
    //   const data = tweets.map(r => ({
    //     // 整理 tweets 資料
    //     ...r.dataValues,
    //     ...r.dataValues.User.toJSON(),
    //     // 計算人數
    //     likeCount: r.Likes.length,
    //     replyCount: r.Replies.length,
    //     //判斷目前登入使用者是否已追蹤該 User 物件 (???)
    //   }))
    //   console.log(data)
    //   return res.render('likes', {
    //     tweets: data
    //   })
    // })
  },

  getTopUsers: (req, res) => {
    Followship.findAll({
      attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
      include: User,
      group: ['followingId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10,
      raw: true, nest: true
    }).then(users => {
      const data = users.map(r => ({
        count: r.count,
        ...r.User,
      }))
      return res.render('topUsersFake', { topUsers: data })
    })
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