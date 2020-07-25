const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', "Confirm password doesn't match.")
      return res.redirect('/signUp')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'Email has been used already.')
          return res.redirect('/signUp')
        } else {
          console.log(req.body)
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'Congrat! You have signed up. Please sign in here.')
            return res.redirect('/signIn')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signIn')
  },

  signIn: (req, res) => {
    req.flash('success_messages', 'Signed in.')
    res.redirect('/')
  },

  signOut: (req, res) => {
    req.flash('success_messages', 'Signed out.')
    req.logout()
    res.redirect('/signIn')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', { user: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profileEdit', { user: user.toJSON() })
      })
  },

  postUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name can't be space")
      return res.redirect('back')
    }

    const { files } = req
    if (files.avatar !== undefined & files.cover === undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/api/users/${user.id}`)
            })
          })
      })
    }

    if (files.avatar === undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.cover[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              cover: files ? img.data.link : user.cover,
            }).then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/api/users/${user.id}`)
            })
          })
      })
    }

    if (files.avatar !== undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            })
              .then(() => {
                imgur.setClientID(IMGUR_CLIENT_ID);
                imgur.upload(files.cover[0].path, (err, img) => {
                  return User.findByPk(req.params.id)
                    .then((user) => {
                      user.update({
                        name: req.body.name,
                        introduction: req.body.introduction,
                        cover: files ? img.data.link : user.cover,
                      }).then((user) => {
                        req.flash('success_messages', 'profile was successfully to update')
                        res.redirect(`/api/users/${user.id}`)
                      })
                    })
                })
              })
          })
      })
    }

    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover,
          })
            .then((user) => {
              req.flash('success_messages', 'profile was successfully to update')
              res.redirect(`/api/users/${user.id}`)
            })
        })
    }
  },

}

module.exports = userController