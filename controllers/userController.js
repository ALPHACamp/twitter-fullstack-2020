const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User //input the user schema

const userController = {
    signInPage: (req, res) => {
        return res.render('signin')
    },

    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/tweets')
    },
    signUpPage: (req, res) => {
        return res.render('signup')
    },
}

module.exports = userController