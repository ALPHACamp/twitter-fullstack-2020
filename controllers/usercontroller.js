const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require('../models')
const { User } = db


//for test only
const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const userController = {
  signInPage: (req, res) => {
    return res.render("signin");
  },
  signupPage: (req, res) => {
    return res.render("signup");
  },

  signup: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      console.log('兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            console.log('此信箱已被註冊！')
            return res.redirect('/signup')
          } else {
            User.findOne({ where: { account: req.body.account } })
              .then(user => {
                if (user) {
                  console.log('此帳號已被使用！')
                  return res.redirect('/signup')
                } else {
                  User.create({
                    name: req.body.name,
                    account: "@" + req.body.account,
                    role: "user",
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                  }).then(user => {
                    console.log('成功註冊帳號！')
                    return res.redirect('/signin')
                  })
                }
              })
          }
        })
    }
  },
};

module.exports = userController;
