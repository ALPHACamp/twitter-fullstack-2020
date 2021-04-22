const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    console.log(req.body)
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { account, name, email, password })
    }
    User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
      .then(user => {
        req.flash('success_msg', '註冊成功，請登入！')
        return res.redirect('/signin')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          req.flash('warning_msg', err.errors[0].message)
          return res.render('signup', { account, name, email, password })
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
          if (err.errors[0].path === 'users.account') {
            req.flash('warning_msg', 'Sorry, account name already registered!')
            return res.render('signup', { account, name, email, password })
          } else {
            req.flash('warning_msg', 'Sorry, email already registered!')
            return res.render('signup', { account, name, email, password })
          }
        }
        return res.send(err)
      })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/users/setting')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  settingPage: (req, res) => {
    const loginUser = helpers.getUser(req)
    console.log(`id:${loginUser.id}`)
    User.findByPk(loginUser.id)
      .then(result => {
        return res.render('userSetting', { result: result.toJSON() })
      })
      .catch(err => res.send(err))
  },
  putSetting: (req, res) => {
    //trim input
    Object.keys(req.body).map(k => req.body[`${k}`] = req.body[`${k}`].trim())
    const { account, name, email, oldPassword, newPassword, checkNewPassword } = req.body
    const loginUser = helpers.getUser(req)
    //check no empty input
    if (!account || !name || !email) {
      req.flash('warning_msg', '請填入account、name、email');
      return res.redirect('back');
    }
    //require old password before changing it
    User.findByPk(loginUser.id)
      .then(user => {
        if (oldPassword && !bcrypt.compareSync(oldPassword, user.password)) {
          req.flash('warning_msg', 'Wrong Old Password!')
          return res.redirect('back')
        }
        //confirm new password input
        if (newPassword !== checkNewPassword) {
          req.flash('warning_msg', '兩次密碼輸入不同！')
          return res.redirect('back')
        }
        //update with password change
        if (oldPassword && newPassword) {
          user.update({
            account,
            name,
            email,
            password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => {
              if (err.name === 'SequelizeValidationError') {
                req.flash('warning_msg', err.errors[0].message)
                return res.redirect('back')
              }
              if (err.name === 'SequelizeUniqueConstraintError') {
                if (err.errors[0].path === 'users.account') {
                  req.flash('warning_msg', 'Sorry, account name already registered!')
                  return res.redirect('back')
                } else {
                  req.flash('warning_msg', 'Sorry, email already registered!')
                  return res.redirect('back')
                }
              }
              return res.send(err)
            })
        } else {
          //update without password change
          user.update({
            account,
            name,
            email
          })
            .then(user => {
              req.flash('success_msg', 'Your setting was successfully updated')
              return res.redirect('/tweets')
            })
            .catch(err => {
              if (err.name === 'SequelizeValidationError') {
                req.flash('warning_msg', err.errors[0].message)
                return res.redirect('back')
              }
              if (err.name === 'SequelizeUniqueConstraintError') {
                if (err.errors[0].path === 'users.account') {
                  req.flash('warning_msg', 'Sorry, account name already registered!')
                  return res.redirect('back')
                } else {
                  req.flash('warning_msg', 'Sorry, email already registered!')
                  return res.redirect('back')
                }
              }
              return res.send(err)
            })
        }
      })
      .catch(err => {
        return res.send(err)
      })
  }
}

module.exports = userController