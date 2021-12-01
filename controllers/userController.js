const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
    getSignUpPage: (req, res) => {
        return res.render('signup')
    },

    postSignUp: (req, res) => {
        console.log(req.body)
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(user => {
            return res.redirect('/signin')
        })
    },

    getSignInPage: (req, res) => {
        return res.render('signin')
    },
}


module.exports = userController