const bcrypt = require('bcryptjs')
const { Sequelize } = require('../models')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const Op = Sequelize.Op


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    console.log(req.body)

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { [Op.or]: [{ email: req.body.email }, { account: req.body.account }] }, raw: true
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) { req.flash('error_messages', '此email已經被註冊') }
          if (user.account === req.body.account) { req.flash('error_messages', '此account已經被註冊') }
          return res.redirect('/signup')
        } else {
          return User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))  //salt = bcrypt.genSaltSync(10)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', "成功登入！")
    res.redirect('/main')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include:[
        {model: Reply, include:[Tweet]},
        {model: Tweet, as: 'LikedUsers'},
        {model:User, as:'Followers'},
        {model:User, as:'Followings'}
      ]
    }).then(user => {
      const userSelf = helpers.getUser(req).id
      const isLiked = helpers.getUser(req).Followings.map(d => d.id).include(user.id)
      res.render({user:user, 
        isLiked: isLiked, 
        userSelf:userSelf})
    })
  }
  
  


}

module.exports = userController