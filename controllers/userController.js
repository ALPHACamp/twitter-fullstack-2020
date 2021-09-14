const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User

const userController = {
    signUpPage: (req, res) => {
        return res.render('regist')
    },

    signUp: (req, res) => {
        console.log(req.body)
        User.create({
            account: req.body.name,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(user => {
            return res.redirect('login')
        })
    },
}

module.exports = userController