const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {

  },

}

module.exports = userController