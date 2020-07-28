const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', { layout: 'blank' })
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
    return res.render('signIn', { layout: 'blank' })
  },

  signIn: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      if (user.role === '1') {
        req.flash('error_messages', 'Admin please signs in with admin sign in page.')
        return res.redirect('back')
      } else {
        req.flash('success_messages', 'Signed in.')
        res.redirect('/')
      }
    })
  },

  signOut: (req, res) => {
    req.flash('success_messages', 'Signed out.')
    req.logout()
    res.redirect('/signin')
  },

  settingPage: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      return res.render('setting', {
        name: user.name,
        email: user.email
      })
    })
  },

  setting: (req, res) => {

    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', "Confirm password doesn't match.")
      return res.redirect('back')

    } else {
      User.findByPk(req.user.id).then(user => {
        let originalName = user.name
        let originalEmail = user.email

        User.findOne({ where: { email: req.body.email } }).then(user => {
          if (user && user.email !== originalEmail) {
            req.flash('error_messages', 'Email has been used already.')
            return res.redirect('back')
          }
        })
        User.findOne({ where: { name: req.body.name } }).then(user => {
          if (user && user.name !== originalName) {
            req.flash('error_messages', 'Name has been used already.')
            return res.redirect('back')
          }
        })
      })
    }

    return User.findByPk(req.user.id)
      .then(user => {
        user.update({
          email: req.body.email,
          name: req.body.name,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
          .then((user) => {
            req.flash('success_messages', 'User was successfully updated')
            res.redirect(`/tweets`)
          })
      })
  }
}

module.exports = userController