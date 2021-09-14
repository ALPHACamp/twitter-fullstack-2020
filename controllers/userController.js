const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', 'Passwords you entered were inconsistent')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error_messages', 'This email address had already been registered!')
        return res.redirect('/signup')
      }
      User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        req.flash('success_messages', 'Your account had been successfully registered!')
        return res.redirect('/signin')
      })
    })
  },

  getUserEdit: (req, res) => {
    //檢查使用者是否在編輯自己的資料
    if (req.params.user_id !== String(helpers.getUser(req).id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/users/${helpers.getUser(req).id}/edit`)
    }
    User.findByPk(req.params.user_id)
      .then(user => {
        return res.render('userEdit', { user: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  getUserSetting: (req, res) => {
    //檢查使用者是否在編輯自己的資料
    if (req.params.user_id !== String(helpers.getUser(req).id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`)
    }
    User.findByPk(req.params.user_id)
      .then(user => {
        return res.render('userSetting', { user: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUserEdit: (req, res) => {
    //是否前端判斷？
    if (!req.body.name || !req.body.introduction) {
      req.flash('error_messages', '不符合條件')
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
                res.redirect('/index')
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
              res.redirect('/index')
            })
            .catch(err => console.error(err))
        })

    }
  },

  //testing upload multiple photos
  // putUserEdit: (req, res) => {
  //   //是否前端判斷？
  //   if(!req.body.name || !req.body.introduction) {
  //     req.flash('error_messages', '不符合條件')
  //     return res.redirect('back')
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


  //   ----
  // if (account.value.length < 5) {
  //   account.classList.add("is-invalid")
  //   event.preventDefault()
  // }
  // if (name.value.length > 50) {
  //   name.classList.add("is-invalid")
  //   event.preventDefault()
  // }
  // if (email.value.length < 1) {
  //   email.classList.add("is-invalid")
  //   event.preventDefault()
  // }
  // if (password.value !== checkPassword.value) {
  //   password.classList.remove("is-invalid")
  //   checkPassword.classList.add("is-invalid")
  //   event.preventDefault()
  // }
  //   ----

  putUserSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (account.length < 5 || !name || name.length > 50 || !email || !password || checkPassword !== password) {
      req.flash('error_messages', '不符合條件')
      return res.redirect('back')
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
            req.flash('success_messages', 'user setting was successfully updated!')
            res.redirect(`/index`)
          })
          .catch(err => console.error(err))
      })
  },


  signInPage: (req, res) => {
    return res.render('signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/index')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

}

module.exports = userController