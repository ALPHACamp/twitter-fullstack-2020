const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User //input the user schema

const userController = {
signInPage: (req, res) => {
    return res.render('signin')
    },
}

module.exports = userController