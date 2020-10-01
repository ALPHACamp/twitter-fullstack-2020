const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers');

const userController = {
  registerPage: (req, res) => {
    return res.render('register', { layout: 'mainLogin' })
  },
  register: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/users/register')
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
            return res.redirect('/users/register')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/users/login')
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
    return res.redirect('/users/login')
  },
  getUser: (req, res) => {
    const reqUser = helpers.getUser(req)
    return User.findByPk(reqUser.id).then(user => {
      return res.render('settings', {
        user: user.toJSON()
      })
    })
  },
  putUser: (req, res) => {
    const { account, name, email, password, confirmPassword } = req.body
    const id = req.params.id
    let passwordCheck = true
    
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
    if (password && !confirmPassword) {
      req.flash('error_messages', 'Please confirm password')
      passwordCheck = false
      return res.redirect('back')
    }
    if (!password && confirmPassword) {
      req.flash('error_messages', 'Password should not be empty')
      passwordCheck = false
      return res.redirect('back')
    }
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        req.flash('error_messages', 'Password and confirmed Password are not matched')
        passwordCheck = false
        return res.redirect('back')
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
  }
}

module.exports = userController