const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User

const adminController = {
  signinPage:(req,res)=>{
    const admin = "admin"
    return res.render('signin', {admin})
  },
  signin:(req,res)=>{
    return res.render('admin/tweets')
  },
  tweetsPage:(req,res)=>{
    return res.render('admin/tweets')
  },
  usersPage:(req,res)=>{
    return res.render('admin/users')
  }
}

module.exports = adminController