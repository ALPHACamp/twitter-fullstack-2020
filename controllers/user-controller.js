const { User } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const userController = {
    loginPage: (req, res) => {
        res.render('login')
    },
    registerPage: (req, res) => {
        res.render('register')
    },
    settingPage: (req, res) => {
        res.render('setting')
    },
    signup: (req, res, next) => {
        const { name, account, email, password, checkPassword } = req.body
        if (!name.trim() || !account.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('欄位不得為空白!')
        if (name.length > 50) throw new Error('名稱上限50字!')
        if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            return User.findOrCreate({ where: { [Op.or]: [{ email }, { account }]}, defaults: { name, account, email, password: hash }})
          })
          .then(user => {
                if (!user[1] ) throw new Error('帳號或email已被註冊!')
                res.redirect('/signin')
                })
          .catch(err => next(err))
       
    },
    getUser: (req, res, next) => {
        res.render('users/profile')
    },
    getFollowers: (req, res, next) => {
        res.render('users/followers')
    },
    getFollowings: (req, res, next) => {
        res.render('users/followings')
    }
}

module.exports = userController