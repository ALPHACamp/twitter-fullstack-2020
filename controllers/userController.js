const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'differenct passwords！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', 'same account')
          return res.redirect('/signup')
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'registered successfully')
            return res.redirect('/login')
          })
        }
      })
    }
  },

















  getUser: (req, res) => {
    // const realUserId = req.user.id
    User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/self')
      })

  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('user/self/edit')
      })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : null,
              background: file ? img.data.link : null,
              profile: req.body.profile
            }).then(user => {
              req.flash('success_messages', 'user was successfully update')
              res.redirect('user/self')
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: user.image,
            background: user.background,
            profile: req.body.profile
          }).then(user => {
            req.flash('success_messages', 'user was successfully update')
            res.redirect('user/self')
          })
        })
    }
  },

}

module.exports = userController