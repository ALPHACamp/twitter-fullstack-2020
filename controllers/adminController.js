const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User

const adminController = {
  signinPage:(req,res)=>{
    const adminMark = "admin"
    return res.render('signin', { adminMark})
  },
  signin:async (req,res)=>{
    const user = await User.findOne({ account: req.body.account})

    if (user.dataValues.isAdmin){
      res.render('admin/tweets')
    }else{
      req.flash('error_msg', '此帳號不是管理者')
      res.render('signin')
    }
  },
  tweetsPage:(req,res)=>{
    return res.render('admin/tweets')
  },
  usersPage:(req,res)=>{
    return res.render('admin/users')
  }
}

module.exports = adminController